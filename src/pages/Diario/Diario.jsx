import { useEffect, useState } from "react";
import Cabecalho from "../../components/cabecalho/Cabecalho";
import Rodape from "../../components/rodape/rodape";
import { useParams } from "react-router-dom";
import axios from 'axios'; 
import { http } from "../../App";
import './Diario.css';

export default function Diario() {
   
    const { day } = useParams();
    const [descricao, setDescricao] = useState('');
    const [feeling, setFeeling] = useState(''); 
    const [dataAtual, setDataAtual] = useState('');
    const [emojiSelecionado, setEmojiSelecionado] = useState('');
    const [mensagem, setMensagem] = useState('');
    
    useEffect(() => {
        const data = new Date();
        const dia = String(data.getDate()).padStart(2, '0');
        const mes = String(data.getMonth() + 1).padStart(2, '0');
        const ano = data.getFullYear();
        setDataAtual(`${dia}/${mes}/${ano}`);
    }, []);

    useEffect(() => {
        if (day) {
            const [diaParam, mesParam, anoParam] = day.split('-');
            setDataAtual(`${diaParam.padStart(2, '0')}/${mesParam.padStart(2, '0')}/${anoParam}`);
        }
    }, [day]);

    const handleDescricaoChange = (e) => setDescricao(e.target.value);

    const handleEmojiClick = (emoji) => {
        setEmojiSelecionado(emoji);
        setFeeling(emoji); 
    };

    const handleSalvar = () => {
        console.log('feeling:', feeling); // para verificar
        console.log('descricao:', descricao); // para verificar como está sendo enviada
    
        if (descricao === '' || emojiSelecionado === '') {
            setMensagem('Por favor, preencha a descrição e selecione um emoji.');
        } else {
            http.post(`/register/report/6646139dd98e3e2d2893731d`, {
                feeling: feeling,
                description: descricao
            })
            .then(response => {
                console.log('Resposta da solicitação:', response);
                setMensagem('Salvo com sucesso!');
                setTimeout(() => setMensagem(''), 3000);
                setDescricao(''); //limpar os dados se for salvo 
                setEmojiSelecionado('');
                setFeeling('');
            })
            .catch(error => {
                console.error('Erro ao enviar dados:', error);
                setMensagem('Erro ao enviar dados. Por favor, tente novamente mais tarde.');
            });
        }
    };
    

    const handleCancelar = () => {
        setMensagem('');
        setDescricao('');
        setEmojiSelecionado('');
        setFeeling(''); 
    };

    return (
        <>
            <Cabecalho />
            <main className="content-container">
                <div className="content-box">
                    <h2>{dataAtual}</h2>
                    <div className="emojis">
                        <span
                            role="img"
                            aria-label="feliz"
                            onClick={() => handleEmojiClick('😊')}
                            className={emojiSelecionado === '😊' ? 'emoji-selecionado' : ''}
                        >😊</span>
                        <span
                            role="img"
                            aria-label="levemente feliz"
                            onClick={() => handleEmojiClick('🙂')}
                            className={emojiSelecionado === '🙂' ? 'emoji-selecionado' : ''}
                        >🙂</span>
                        <span
                            role="img"
                            aria-label="neutro"
                            onClick={() => handleEmojiClick('😐')}
                            className={emojiSelecionado === '😐' ? 'emoji-selecionado' : ''}
                        >😐</span>
                        <span
                            role="img"
                            aria-label="triste"
                            onClick={() => handleEmojiClick('🙁')}
                            className={emojiSelecionado === '🙁' ? 'emoji-selecionado' : ''}
                        >🙁</span>
                        <span
                            role="img"
                            aria-label="irritado"
                            onClick={() => handleEmojiClick('😠')}
                            className={emojiSelecionado === '😠' ? 'emoji-selecionado' : ''}
                        >😠</span>
                    </div>
                    <label htmlFor="descricao">Descrição:</label>
                    <textarea
                        id="descricao"
                        value={descricao}
                        onChange={handleDescricaoChange}
                        placeholder="Por que você está se sentindo assim?"
                    />
                    <div className="botoes">
                        <button className="botao-salvar" onClick={handleSalvar}>SALVAR</button>
                        <button className="botao-cancelar" onClick={handleCancelar}>CANCELAR</button>
                    </div>
                    {mensagem && <div className="mensagem">{mensagem}</div>}
                </div>
            </main>
            <Rodape />
        </>
    )
}
