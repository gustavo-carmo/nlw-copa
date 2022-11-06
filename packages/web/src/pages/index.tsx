import Image from 'next/image';
import appPreviewImage from '../assets/app-nlw-copa-preview.png';
import logoImg from '../assets/logo.svg';
import usersAvatarExampleImg from '../assets/users-avatar-example.png';
import iconCheckImg from '../assets/icon-check.svg';
import { GetServerSideProps, GetStaticProps } from 'next';
import { api } from '../services/api';
import { FormEvent, useState } from 'react';

type HomeProps = {
  usersCount: number;
  guessesCount: number;
  poolsCount: number;
}

export default function Home({guessesCount, poolsCount, usersCount }: HomeProps) {
  const [poolTitle, setPoolTitle] = useState('');

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const response = await Promise.all([
    api.get('/users/count'),
    api.get('/guesses/count'),
    api.get('/pools/count')
  ]);
    console.log('Response -> ', response);


    return;
    try {
      const response = await api.post('pools', {
        title: poolTitle
      });

      const { code } = response.data;

      await navigator.clipboard.writeText(code);

      alert(`Bolão criado com sucesso, o código[${code}] foi copiado para a área de transferência!`)

      setPoolTitle('');
    } catch (err) {
      console.error(err);
      alert('Falha ao criar o bolão, tente novamente!');
    }
  }

  return (
    <div className='max-w-[1124px] mx-auto h-screen grid grid-cols-2 items-center gap-28 px-10'>
      <main>
        <Image src={logoImg} alt="NLW Copa" />

        <h1 className='mt-14 text-5xl text-white font-bold leading-tight'>Crie seu próprio bolão da copa e compartilhe entre amigos!</h1>

        <div className='mt-10 flex items-center gap-2'>
          <Image src={usersAvatarExampleImg} alt="" />
          <strong className='text-gray-100 text-xl'>
            <span className='text-ignite-500'>+ {usersCount}</span> pessoas já estão usando
          </strong>
        </div>

        <form onSubmit={handleSubmit} className='mt-10 flex gap-2'>
          <input 
            className='flex-1 bg-gray-800 py-4 px-6 border border-gray-600 rounded text-sm text-gray-100'
            type="text" 
            required 
            placeholder='Qual o nome do seu bolão?'
            value={poolTitle}
            onChange={(event) => setPoolTitle(event.target.value)}
          />
          <button 
            type='submit'
            className='bg-yellow-500 py-4 px-6 rounded text-gray-900 font-bold text-sm uppercase hover:bg-yellow-700'
          >
            Crie meu bolão
          </button>
        </form>

        <p className='text-gray-300 mt-4 text-sm leading-relaxed'>
          Após criar seu bolão, você receberá um código único que poderá usar para convidar outras pessoas 🚀
        </p>

        <div className='flex mt-10 pt-10 border-t border-gray-600 items-center justify-between text-gray-100'>
          <div className='flex items-center gap-6'>
            <Image src={iconCheckImg} alt="check"/>
            <div className='flex flex-col'>
              <span className='font-bold text-2xl'>+{poolsCount}</span>
              Bolões criados
            </div>
          </div>

          <div className='w-px h-14 bg-gray-600'></div>

          <div className='flex items-center gap-6'>
            <Image src={iconCheckImg} alt="check"/>
            <div className='flex flex-col'>
              <span className='font-bold text-2xl'>+{guessesCount}</span>
              Palpites enviados
            </div>
          </div>
        </div>
      </main>

      <Image 
        src={appPreviewImage}
        alt="Dois celulares mostrando o preview do App"
        quality={100}
      />
      
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const [
    usersCount,
    guessesCount,
    poolsCount
  ] = await Promise.all([
    api.get('/users/count'),
    api.get('/guesses/count'),
    api.get('/pools/count')
  ]);

  return {
    props: {
      usersCount: usersCount.data.count,
      guessesCount: guessesCount.data.count,
      poolsCount: poolsCount.data.count,
    },
    revalidate: 1000 * 60 * 10 // 10 min
  }
}