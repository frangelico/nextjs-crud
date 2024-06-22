'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
// import { signIn } from '@/auth';
// import { AuthError } from 'next-auth';
const bcrypt = require('bcrypt');

const FormSchema = z.object({
    id: z.string(),
    userId: z.string(
        {
            invalid_type_error: 'Please select a user',
        }
    ),
    address: z.coerce.string(
      {
        invalid_type_error: 'Please enter a wallet address.',
    }),
    status: z.enum(['active', 'inactive'], {
        invalid_type_error: 'Please select a status',
    }),
    date: z.string(),
});

const FormUserSchema = z.object({
  id: z.string(),
  name: z.string(
      {
          required_error: "Name is required",
          invalid_type_error: 'Please enter a name',
      }
  ).min(1, "Name cannot be empty"),
  email: z.string(
    {
      required_error: "Email is required",
      invalid_type_error: 'Please enter a email address.',
  }).email(
    {
      message: 'Invalid email address'
    }
  ),
  password: z.string(
    {
      required_error: "Password is required",
      invalid_type_error: 'Please enter a password.',
    })
});

//#region Create
const CreateWallet = FormSchema.omit({ id: true, date: true});

const CreateUser = FormUserSchema.omit({ id: true }).merge(z.object({
  password: z.string(
    {
      required_error: "Password is required",
      invalid_type_error: 'Please enter a password.',
    }).min(1, 'Password cannot be empty')
}));

// This is temporary until @types/react-dom is updated
export type WalletState = {
    errors?: {
      userId?: string[];
      address?: string[];
      status?: string[];
    };
    message?: string | null;
  };

// This is temporary until @types/react-dom is updated
export type UserState = {
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
  };
  message?: string | null;
};

export async function createWallet(pevState: WalletState, formData: FormData) : Promise<WalletState> {
    const validatedFields = CreateWallet.safeParse({
        userId: formData.get('userId'),
        address: formData.get('address'),
        status: formData.get('status'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing fields. Failed to Create Wallet',
        }
    }

    const { userId, address, status } = validatedFields.data;
    const adressEncoded = address;
    const date = new Date().toISOString().split('T')[0];
    let result = null;
    try {
        result = await sql`
            INSERT INTO wallet_address ( user_id, address, status, date)
            VALUES (${userId}, ${adressEncoded}, ${status}, ${date}) RETURNING *
        `;
    } catch (error) {
        return {
            message: 'Database Error: Failed to Create Wallet.'
        };
    }

    revalidatePath('/wallets')

    if (result && result.rows[0].id) {
      // console.log(`Succesfully inserted result: ${JSON.stringify(result)}}`);
      redirect(`/wallets/${result.rows[0].id}/edit`);
    } else redirect('/wallets');
    
}

export async function createUser(pevState: UserState, formData: FormData) : Promise<UserState> {

  // CreateUser.superRefine(((input, ctx) => {
  //   if (input.password == undefined || input.password == null || input.password.length < 1) {      
  //     ctx.addIssue({
  //       code: z.ZodIssueCode.custom,
  //       path: ['password'],
  //       message: `Passsord cannot be empty.`
  //     });
  //     return false;
  //   }
  // }));

  // console.log(`Password is ${formData.get('password')}:${typeof formData.get('password')}`);
  

  const validatedFields = CreateUser.safeParse({
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password')
  });

  if (!validatedFields.success) {
    console.log(`Validation error: ${JSON.stringify(validatedFields.error.flatten().fieldErrors)}`);

      return {
          errors: validatedFields.error.flatten().fieldErrors,
          message: 'Missing fields. Failed to Create User',
      }
  }

  const { name, email, password } = validatedFields.data;
  const emailEncoded = email;
  const hashedPassword = await bcrypt.hash(password, 10);

  let result = null;
  try {
      result = await sql`
          INSERT INTO "user" (name, email, password)
          VALUES (${name}, ${emailEncoded}, ${hashedPassword}) RETURNING *
      `;
  } catch (error) {
    console.log(`Insert error: ${JSON.stringify(error)}`);

      return {
          message: 'Database Error: Failed to Create User.'
      };
  }

  revalidatePath('/users')

  if (result && result.rows[0].id) {
    // console.log(`Succesfully inserted result: ${JSON.stringify(result)}}`);
    redirect(`/users/${result.rows[0].id}/edit`);
  } else redirect('/users');
  
}
//#endregion

// #region Edit
// Use Zod to update the expected types
const UpdateWallet = FormSchema.omit({ id: true, date: true });
 
// ...
 
export async function updateWallet(id: string, prevSatate: WalletState, formData: FormData) : Promise<WalletState> {

  const validatedFields = UpdateWallet.safeParse({
    userId: formData.get('userId'),
    address: formData.get('address'),
    status: formData.get('status'),
  });
 
  if (!validatedFields.success) {
    return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'Missing fields. Failed to Updated Wallet.',
    }
  }
  const { userId, address, status } = validatedFields.data;
  const addressEncoded = address;
 

    try {
        await sql`
            UPDATE "wallet_address"
            SET user_id = ${userId}, address = ${addressEncoded}, status = ${status}
            WHERE id = ${id}
        `;
    } catch (error) {
        console.log(`Update error: ${JSON.stringify(error)}`);        
        return {
            message: 'Database Error: Failed to Update Wallet'
        };
    }
 
  revalidatePath('/wallets');
  redirect('/wallets');
}


// Use Zod to update the expected types
const UpdateUser = FormUserSchema.omit({ id: true}).partial({password: true});
 
// ...
 
export async function updateUser(id: string, prevSatate: UserState, formData: FormData) : Promise<UserState> {

  // if (formData.get('password') == undefined || formData.get('password') == null || formData.get('password')?)
  // UpdateUser.refine();

  // UpdateUser.refine( inputs => {
  //   console.log(`Password: ${inputs.password}`)
  //   if (inputs.password == undefined || inputs.password == null || inputs.password === '' ) return true;
  //   return true;
  // });

  // const UpdateSchema = FormUserSchema.optional({password});
  // UpdateSchema.optional()
  // z.optional(FormUserSchema, )
  // UpdateUser.merge(z.object({
  //   password: z.string(
  //     {      
  //       invalid_type_error: 'Please enter a password.'
  //     }
  //   ).optional()
  // }));    

  const validatedFields = UpdateUser.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password')
  });

  if (!validatedFields.success) {
    console.log(`Validation error: ${JSON.stringify(validatedFields.error.flatten().fieldErrors)}`);
    
    return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'Missing fields. Failed to Update user.',
    }
  }

  console.log(`Retrieving data`);
  const { name, email, password } = validatedFields.data;
  const addressEncoded = email; 
  
    try {
      console.log(`SQL update name and email: ${id}:${name}:${addressEncoded}`);
        const result = await sql`
            UPDATE "user"
            SET name = ${name}, email = ${addressEncoded}
            WHERE id = ${id}
        `;
        // console.log(`Result is ${result.command}`);
        
    } catch (error) {
        console.log(`SQL update name and email: ${JSON.stringify(error)}`);
        return {
            message: 'Database Error: Failed to Update User'
        };
    }

    if (password && password.length > 0) {
      const hashedPassword = await bcrypt.hash(password, 10);

      try {
        console.log(`SQL update password`);
        await sql`
            UPDATE user
            SET password = ${hashedPassword} 
            WHERE id = ${id}
        `;
      } catch (error) {
          return {
              message: 'Database Error: Failed to Update User Password'
          };
      }
    }

    console.log(`Redirecting`);
  revalidatePath('/users');
  redirect('/users');
}
//#endregion

//#region Delete
export async function deleteWallet(id: string) {

    try {
        await sql`DELETE FROM wallet_address WHERE id = ${id}`;
        revalidatePath('/wallets');
        return {
            message: 'Deleted wallet'
        };

    } catch (error) {
        return {
            message: 'Database Error: Failed to Delete Wallet.'
        };
    }    
}

export async function deleteUser(id: string) {

  try {
      await sql`DELETE FROM user WHERE id = ${id}`;
      revalidatePath('/users');
      return {
          message: 'Deleted user'
      };

  } catch (error) {
      return {
          message: 'Database Error: Failed to Delete User.'
      };
  }   
}
//#endregion

//#region Authenticate
// export async function authenticate(
//     prevState: string | undefined,
//     formData: FormData,
//   ) {
//     try {
//       await signIn('credentials', formData);
//     } catch (error) {
//       if (error instanceof AuthError) {
//         switch (error.type) {
//           case 'CredentialsSignin':
//             return 'Invalid credentials.';
//           default:
//             return 'Something went wrong.' && (error.message ? ' '+ error.message :'');
//         }
//       }
//       throw error;
//     }
//   }
//#endregion