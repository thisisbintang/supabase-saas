import React from 'react'
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/auth';

export interface RegisterBody {
    email: string;
    angkatan: string;
    nama: string;
    nim: string;
    no_hp: string;
    password: string;
    prodi: string;
}

const Register = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { register: registerAuth } = useAuth()
    const onSubmit = (data: RegisterBody) => registerAuth(data);

    return (
        <div className='container mx-auto mt-4 rounder shadow p-8 gap-y-3'>
            <h2 className='mb-4 text-xl font-medium text-center'>Register</h2>
            <form
                className='flex flex-col gap-y-4 items-center'
                onSubmit={handleSubmit(onSubmit as any)}>
                <input
                    className='input input-bordered w-full max-w-xs'
                    type="text" placeholder="Email" {...register("email", { required: true, pattern: /^\S+@\S+$/i })} />
                <input
                    className='input input-bordered w-full max-w-xs'
                    type="tel" placeholder="Nomor HP" {...register("no_hp", { required: true, maxLength: 12 })} />
                <input
                    className='input input-bordered w-full max-w-xs'
                    type="text" placeholder="Nama" {...register("nama", { required: true })} />
                <input
                    className='input input-bordered w-full max-w-xs'
                    type="text" placeholder="NIM" {...register("nim", { required: true, maxLength: 13, minLength: 12 })} />
                <input
                    className='input input-bordered w-full max-w-xs'
                    type="text" placeholder="Prodi"  {...register("prodi", { required: true })} />
                <input
                    className='input input-bordered w-full max-w-xs'
                    type="text" placeholder="Angkatan"  {...register("angkatan", { required: true })} />
                <input
                    className='input input-bordered w-full max-w-xs'
                    type="password" placeholder="Password"  {...register("password", { required: true })} />

                <input
                    className='btn self-end' type="submit" />
            </form>
        </div>
    )
}

export default Register