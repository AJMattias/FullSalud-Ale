import { Base } from '../../common/bases/base.entity';
import {
    Column,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
} from 'typeorm';
import {
    Medication,
    Patient,
    Practitioner,
} from '.';

@Entity('medication_request')
export class MedicationRequest extends Base {

    @Column({
        type: 'varchar',
        nullable: false
    })
    indications: string;
    @Column({
        type: 'varchar',
        nullable: false
    })
    diagnosis: string; //No esta en Figma

    @Column({
        type: 'boolean',
        nullable: false,
        name: 'is_valid_signature',
        default: false
    })
    isValidSignature: boolean; //Que es?

    @ManyToOne(() => Practitioner)
    @JoinColumn({ name: 'practitioner_id' })
    practitioner: Practitioner;

    @ManyToOne(() => Patient)
    @JoinColumn({ name: 'patient_id' })
    patient: Patient; //datos del paciente

    @ManyToMany(() => Medication, (medicine) => medicine.id)
    @JoinTable()
    medicines: Medication[];

    //Nuevos atributos de figma
    @Column({
        type: 'boolean',
        nullable:false
    })
    prolonged_treatment: boolean;

    @Column({
        type: 'boolean',
        nullable:false
    })
    hiv: boolean;

    @Column({
        type: 'varchar',
        nullable:false
    })
    generic_name: string;

    @Column({
        type: 'varchar',
        nullable:false
    })
    medicine_presentation: string;

    @Column({
        type: 'varchar',
        nullable:false
    })
    medicine_pharmaceutical_form: string;

    @Column({
        type: 'int',
        nullable:false
    })
    medicine_quantity: number;
     


}
