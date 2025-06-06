'use server';

import { redirect } from 'next/navigation';

const REGISTER_USER_MUTATION = `
  mutation CreateUser($name: String!, $email: String!, $password: String!) {
    createUser(input: { name: $name, email: $email, password: $password }) {
      id
      email
      name
    }
  }
`;

export async function registerUser(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  if (password !== confirmPassword) {
    redirect('/register?error=Passwords%20do%20not%20match');
  }

  const res = await fetch('http://localhost:3000/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: REGISTER_USER_MUTATION,
      variables: { name, email, password },
    }),
  });

  const json = await res.json();

  if (json.errors) {
    redirect(`/register?error=${encodeURIComponent(json.errors[0].message)}`);
  }

  redirect('/login');
}
