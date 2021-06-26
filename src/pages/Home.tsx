import {FormEvent, useState} from 'react';
import {useHistory} from 'react-router-dom';
import Switch  from 'react-switch';

import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import googleIconImg from '../assets/images/google-icon.svg';

import '../styles/auth.scss';

import { Button } from '../components/Button';
import { useAuth } from '../hooks/useAuth';
import { database } from '../services/firebase';
import { useTheme } from '../hooks/useTheme';


export function Home() {
  const history = useHistory();
  const {user, signInWithGoogle} = useAuth();
  const {theme, toggleTheme} = useTheme();
  const [roomCode, setRoomCode] = useState('');
  const [switchTheme, setSwitchTheme] = useState(false);
  async function handleCreateRoom() {
    if(!user) {
      await signInWithGoogle()
    }

    history.push('/rooms/new');
  }

  async function handleJoinRoom(event: FormEvent) {
    event.preventDefault();
    
    if(roomCode.trim() === '') {
      return;
    }

    const roomRef = await database.ref(`rooms/${roomCode}`).get();
  
    if(!roomRef.exists()) {
      alert('Room does not exists.');
      return;
    }

    if(roomRef.val().endedAt) {
      alert ("Room already closed");
      return;
    }

    history.push(`/rooms/${roomCode}`);
  } 

  function handleSwitchTheme() {
    if(switchTheme) {
      toggleTheme();
      setSwitchTheme(false);
    } else {
      toggleTheme();
      setSwitchTheme(true);
    }
  }

  return(
    <div id="page-auth" className={theme}>
      <aside>
        <img src={illustrationImg} alt="Ilustração simbolizando  perguntas e respostas" />
        <strong>Crie salas de Q&amp;A ao-vivo</strong>
        <p>Tire as duvidas da sua audiência em tempo-real</p>
      </aside>
      <main>
        <div className="main-content">
          <div className="theme-switcher">
            <h1>tema {theme}</h1>
            <Switch 
              onChange= {handleSwitchTheme} 
              checked={switchTheme}
              checkedIcon={false}
              uncheckedIcon={false}
              onColor={'#FFF'}
              onHandleColor={'#888888'}
              ></Switch>
            {/* <button onClick={toggleTheme}>Troca tema</button> */}
          </div>
          <img src={logoImg} alt="Letmeask" />
          <button onClick={handleCreateRoom} className="create-room">
            <img src={googleIconImg} alt="Logo do google" />
            Cria sua sala com o google
            </button>
            <div className="separator">ou entre em uma sala</div>
            <form onSubmit={handleJoinRoom}>
              <input 
                type="text"
                placeholder="Digite o código da sala" 
                onChange= {event => setRoomCode(event.target.value)}
                value={roomCode}
              />
              <Button type="submit">
                Entrar na sala
              </Button>
            </form>
        </div>
      </main>
    </div>
  );
}