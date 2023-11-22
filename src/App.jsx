import React, { useState } from 'react';
import './App.css';
import axios from 'axios';
import { BsRobot } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import { IoIosRefresh } from "react-icons/io";
import { format } from 'date-fns';
import _ from 'lodash'

const Chat = () => {

  
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

 


  const handleSubmit = async (e) => {

    e.preventDefault();
    if (!message) return; // Previene el envío de mensajes vacíos

    try {
      const parametros = { chat: message };
      const response = await axios.post('http://localhost:9000/chats', parametros);

      const mensajes = _.sortBy(response?.data?.data, 'fecha')

      setMessages(mensajes)
      setMessage('');       // Limpiar el textarea después de enviar el mensaje

    } catch (error) {
      console.error('Hubo un error al enviar el mensaje:', error);
    }

  };


  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      await axios.delete('http://localhost:9000/chats')
      setMessages([])
    } catch (error) {
      console.log('error al borrar', error)
    }
  }

  
  const handleRefresh = async (e) => {
    e.preventDefault();
    try {
      const msgs = await axios.get('http://localhost:9000/chats')
      setMessages( _.sortBy( msgs?.data?.data, 'fecha' ) )
    } catch (error) {
      console.log('error al borrar', error)
    }
  }



  return (
    <div className='flex flex-col h-screen'> 

      {/* Título */}
      <div className='fixed top-0 left-0 right-0 p-5 z-10 bg-gray-900'>
        <div className='max-w-4xl mx-auto'>
          <h1 className='flex items-center gap-5 font-bold text-white'><BsRobot /> ChatBot IA - UDA</h1>
        </div>
      </div>

      <div className='mt-20 mb-5 px-2 text-right space-x-4'>
        <button 
            className="bg-gray-700 hover:bg-gray-400 hover:text-gray-800 text-gray-200 font-semibold py-2 px-4 border border-gray-400 rounded shadow" 
            type="submit"
            onClick={ handleRefresh }
          >
            <IoIosRefresh size={20} />
        </button>
        <button 
            className="bg-gray-700 hover:bg-gray-400 hover:text-gray-800 text-gray-200 font-semibold py-2 px-4 border border-gray-400 rounded shadow" 
            type="submit"
            onClick={ handleDelete }
          >
            <MdDelete size={20} />
        </button>
      </div>

      {/* Historial de Mensajes */}
      <ul className='overflow-auto px-5 text-left'>
        {
          messages.map((msg, index) => (
              <li key={msg?.fecha} className='py-2 divide-slate-700' > 
              { format( new Date(msg.fecha), 'HH:mm:ss') } [{ msg?.role }]: {msg.content}</li>
          ))
        }
      </ul>


      {/* Parte Inferior: form de pregutnas */}
      <div className='fixed bottom-0 left-0 right-0 p-5 z-10 bg-gray-900'>
        <div className='max-w-6xl mx-auto flex items-center gap-4'>

          <form onSubmit={handleSubmit} className='flex-grow'>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows="2"
              className='w-full'
            />
          </form>

          <button 
            className="bg-gray-700 hover:bg-gray-400 hover:text-gray-800 text-gray-200 font-semibold py-2 px-4 border border-gray-400 rounded shadow" 
            type="submit"
            onClick={ handleSubmit }
          >
            Preguntar al Bot
          </button>
          

        </div>
      </div>

    </div>
  );
}



export default function App() {
  return <Chat />;
}
