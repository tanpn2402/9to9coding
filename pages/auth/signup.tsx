import { gql, useMutation } from '@apollo/client';
import { Alert, Box, Button, Text, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconAlertCircle } from '@tabler/icons-react';
import Head from 'next/head';
import { useRouter } from 'next/router';

type SignUpForm = {
  name: string;
  email: string;
  password: string;
};

const SignUpMutation = gql`
  mutation SignUp($password: String!, $name: String!, $email: String!) {
    result: signUp(password: $password, name: $name, email: $email) {
      id
    }
  }
`;
type SignUpResult = {
  result: {
    id?: string;
  };
};

const SignInPage = () => {
  const router = useRouter();
  const signUpForm = useForm<SignUpForm>({
    validate: {
      email: value =>
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/gm.test(value)
          ? null
          : 'Email không hợp lệ',
      password: value =>
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/gm.test(value) ? null : (
          <Box>
            <Title order={6}>
              Để đảm bảo cho tài khoản được an toàn, hãy chắc rằng mật khẩu của bạn:
            </Title>
            <ul style={{ listStyle: 'initial', paddingLeft: 15 }}>
              <li>
                <Text>Ít nhất một chữ cái viết hoa.</Text>
              </li>
              <li>
                <Text>Ít nhất một chữ thường.</Text>
              </li>
              <li>
                <Text>Ít nhất một chữ số.</Text>
              </li>
              <li>
                <Text>Độ dài tối thiểu 8 ký tự.</Text>
              </li>
            </ul>
          </Box>
        )
    },
    validateInputOnBlur: true
  });

  const [signUp, { loading, error }] = useMutation<SignUpResult>(SignUpMutation);

  const handleSignUp = async ({ name, password, email }: SignUpForm) => {
    const resp = await signUp({
      variables: {
        name,
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
        <title>Gì đó - Đăng kí hả?</title>
        <meta name='description' content='Gì đó - Trang này nói về cái gì đó' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main className='h-screen w-screen flex items-center justify-center'>
        <Box w={460} mx='auto'>
          <form onSubmit={signUpForm.onSubmit(handleSignUp)}>
            <Title order={1}>Đăng kí</Title>
            <TextInput
              mt='lg'
              label='Tên của bạn'
              placeholder='Tên của bạn'
              disabled={loading}
              {...signUpForm.getInputProps('name')}
            />
            <TextInput
              mt='sm'
              label='Email'
              placeholder='Email'
              disabled={loading}
              {...signUpForm.getInputProps('email')}
            />
            <TextInput
              mt='sm'
              label='Mật khẩu'
              placeholder='********'
              disabled={loading}
              {...signUpForm.getInputProps('password')}
            />

            {error && (
              <Alert mt='lg' icon={<IconAlertCircle size='1rem' />} title='Bummmm...' color='red'>
                Có gì đó sai sai ở đây, hãy kiểm tra lại các thông tin trên và thử lại. Nếu bạn
                không sai thì chúng tôi sai.
              </Alert>
            )}

            <Button type='submit' mt='lg' loading={loading}>
              Đăng kí
            </Button>
          </form>
        </Box>
      </main>
    </>
  );
};

export default SignInPage;
