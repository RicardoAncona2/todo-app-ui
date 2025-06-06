'use server';

const REGISTER_USER_MUTATION = `
  mutation Register($name: String!, $email: String!, $password: String!) {
    register(name: $name, email: $email, password: $password) {
      id
      email
    }
  }
`;

export async function handleRegister(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  if (password !== confirmPassword) {
    // Redirect with an error query param (optional)
    return {
      redirect: `/register?error=${encodeURIComponent("Passwords do not match")}`,
    };
  }

  const response = await fetch('http://localhost:3000/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: REGISTER_USER_MUTATION,
      variables: { name, email, password },
    }),
  });

  const json = await response.json();

  if (json.errors) {
    return {
      redirect: `/register?error=${encodeURIComponent(json.errors[0].message)}`,
    };
  }

  // Redirect to login or dashboard after successful registration
  return {
    redirect: '/login',
  };
}
