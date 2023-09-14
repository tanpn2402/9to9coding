import Head from 'next/head';
import { useRouter } from 'next/router';
import { useForm } from '@mantine/form';
import { gql, useMutation } from '@apollo/client';
import { Alert, Box, Button, TextInput, Title } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';

type SignInForm = {
  email: string;
  password: string;
};

const SignInMutation = gql`
  mutation SignIn($password: String!, $email: String!) {
    result: signIn(password: $password, email: $email) {
      id
    }
  }
`;
type SignInResult = {
  result: {
    id?: string;
  };
};

const SignInPage = () => {
  const router = useRouter();

  const signInForm = useForm<SignInForm>({
    validate: {
      email: value =>
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/gm.test(value)
          ? null
          : 'Email không hợp lệ',
      password: value =>
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/gm.test(value) ? null : 'Mật khẩu không hợp lệ'
    },
    validateInputOnBlur: true
  });

  const [signIn, { loading, error }] = useMutation<SignInResult>(SignInMutation);

  const handleSignIn = async ({ password, email }: SignInForm) => {
    const resp = await signIn({
      variables: {
        password,
        email
      }
    });
    if (resp?.data?.result?.id) {
      router.push('/');
    }
  };

  return (
    <>
      <Head>
        <title>Gì đó - Đăng nhập hả?</title>
        <meta name='description' content='Gì đó - Trang này nói về cái gì đó' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main className='h-screen w-screen flex items-center justify-center'>
        <Box w={460} mx='auto'>
          <form onSubmit={signInForm.onSubmit(handleSignIn)}>
            <Title order={1}>Đăng nhập</Title>
            <TextInput
              mt='lg'
              label='Email'
              placeholder='Email'
              disabled={loading}
              {...signInForm.getInputProps('email')}
            />
            <TextInput
              mt='sm'
              label='Mật khẩu'
              placeholder='********'
              disabled={loading}
              {...signInForm.getInputProps('password')}
            />

            {error && (
              <Alert mt='lg' icon={<IconAlertCircle size='1rem' />} title='Bummmm...' color='red'>
                Có gì đó sai sai ở đây, hãy kiểm tra lại các thông tin trên và thử lại. Nếu bạn
                không sai thì chúng tôi sai.
              </Alert>
            )}

            <Button type='submit' mt='lg' loading={loading}>
              Đăng nhập
            </Button>
          </form>
        </Box>
      </main>
    </>
  );
};

export default SignInPage;
