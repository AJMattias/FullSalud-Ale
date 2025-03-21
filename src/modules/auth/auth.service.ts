import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../../common/bases/base.service';
import { ErrorManager } from '../../common/exceptions/error.manager';
import {
  UserDto,
  UpdateUserDto,
  AuthUserDto,
  SerializerUserDto
} from '../../domain/dtos';
import 'multer';
import { Patient, Practitioner, User } from '../../domain/entities';
import { Role } from '../../domain/enums/role.enum';
import {
  Repository,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { plainToInstance } from 'class-transformer';
import { JwtService } from '@nestjs/jwt';
import { envConfig } from '../../config/envs';
import { put } from '@vercel/blob';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService extends BaseService<
  User,
  UserDto,
  UpdateUserDto
> {
  constructor(
    @InjectRepository(User) protected repository: Repository<User>,
    @InjectRepository(Patient) private readonly patientRepository: Repository<Patient>,
    @InjectRepository(Practitioner) private readonly practitionerRepository: Repository<Practitioner>,
    private readonly jwtService: JwtService,
  ) {
    super(repository);
  }

  async onModuleInit() {
    await this.ensureAdminExists();
  }

  async signJWT(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }

  async loginUser(loginDto: AuthUserDto)/*: Promise<UserDto & { accessToken: string; refreshToken: string }>*/ {
    const { email, username, password } = loginDto;
    try {
      const user: User | undefined = await this.patientRepository.findOne({
        where: [{ email: email ?? undefined }, { username: username ?? undefined }],
      }) || await this.practitionerRepository.findOne({
        where: [{ email: email ?? undefined }, { username: username ?? undefined }],
      }) || await this.repository.findOne({
        where: [{ email: email ?? undefined }, { username: username ?? undefined }],
      });

      if (!user) {
        throw new ErrorManager('Invalid email, username, or password', 401);
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      
      if (!isPasswordValid) {
        throw new ErrorManager('Invalid email, username, or password', 401);
      }

      const payload: JwtPayload = { id: user.id, email: user.email, role: user.role, name: user.name, lastName: user.lastName };
      const accessToken = await this.signJWT(payload);

      const userDto = plainToInstance(SerializerUserDto, user);
      const { id, name, lastName, email: newEmail, role, urlImg, ...rest} = userDto;
      return { id, name, lastName, email: newEmail, role, urlImg, accessToken };
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }
  
  async generateRefreshToken(token: string) {
    try {
      const { sub, iat, exp, ...user} = this.jwtService.verify(token, {
        secret: envConfig.JWT_SECRET,
      });

      const userDto = plainToInstance(SerializerUserDto, user);

      return {
        ...userDto,
        accessToken: await this.signJWT(user)
      }
      
    } catch (error) {
      console.log(error);
    }
  }

  async createAdmin(createUserDto: AuthUserDto): Promise<UserDto> {
    try {
      const existingUser = await this.repository.findOne({
        where: [
          { email: createUserDto.email },
          { username: createUserDto.username }
        ],
      });
  
      if (existingUser) {
        throw new ErrorManager('Email or username already in use', 400);
      }
  
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
  
      const newAdmin = this.repository.create({
        ...createUserDto,
        password: hashedPassword,
        role: Role.ADMIN,
      });
  
      const savedAdmin = await this.repository.save(newAdmin);
  
      return plainToInstance(UserDto, savedAdmin, { excludeExtraneousValues: true });
  
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  async ensureAdminExists() {
    const adminExists = await this.repository.findOne({
      where: { role: Role.ADMIN },
    });

    if (!adminExists) {
      console.log('No admin found. Creating default admin...');

      const defaultAdmin = this.repository.create({
        email: 'admin@example.com',
        username: 'admin',
        password: await bcrypt.hash('Admin123*', 10),
        role: Role.ADMIN,
        name: 'Default',
        lastName: 'Admin',
      });

      await this.repository.save(defaultAdmin);
      console.log('Default admin created successfully.');
    }
  }

  async getUserById(userId: string): Promise<User> {
    try {
      const user: User | undefined = await this.patientRepository.findOne({
        where: [{ id: userId ?? undefined }],
      }) || await this.practitionerRepository.findOne({
        where: [{ id: userId ?? undefined }],
      }) || await this.repository.findOne({
        where: [{ id: userId ?? undefined }],
      });
  
      if (!user) {
        throw new ErrorManager('Invalid User by id', 401);
      }

      return user;
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }    
  }

  async uploadImage(file: Express.Multer.File): Promise<string> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    // Validar el tipo de archivo
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Invalid file type. Only JPEG, PNG, GIF, and WEBP are allowed');
    }

    // Validar el tamaño del archivo
    const maxFileSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxFileSize) {
      throw new BadRequestException('File size exceeds the maximum allowed size of 5MB');
    }

    try {
      const blob = await put(file.originalname, file.buffer, {
        access: 'public',
        token: process.env.BLOB_READ_WRITE_TOKEN,
      });

      return blob.url;
    } catch (error) {
      throw new BadRequestException('Failed to upload image');
    }
  }

  async googleSignIn(req) {
    if (!req.user) {
      throw new HttpException('No user from Google', 400);
    }

    const { email, firstName, lastName, picture, birthDate, sex, phoneNumber, address, username } = req.user;
    
    const user: User | undefined = await this.patientRepository.findOne({
      where: {googleBool: true, email: email},
    }) || await this.practitionerRepository.findOne({
      where: {googleBool: true, email: email},
    }) || await this.repository.findOne({
      where: {googleBool: true, email: email},
    });

    const exist: User | undefined = await this.patientRepository.findOne({
      where: { email: email },
    }) || await this.practitionerRepository.findOne({
      where: { email: email },
    }) || await this.repository.findOne({
      where: { email: email },
    });

    if(!user && exist) {
      return new HttpException('Email already in use', 400);
    }

    if(user) {
      const payload: JwtPayload = { id: user.id, email: user.email, role: user.role, name: user.name, lastName: user.lastName };
      const accessToken = await this.signJWT(payload);

      const userDto = plainToInstance(SerializerUserDto, user);
      const { id, name, lastName, email: newEmail, role, urlImg, ...rest} = userDto;
      return { id, name, lastName, email: newEmail, role, urlImg, accessToken };
    } else {
      return {
        email: email,
        name: firstName,
        lastName: lastName,
        username: username,
        urlImg: picture,
      }
    }
  }
}
