import { useEffect, useState } from "react";
import Cabecalho from "../../components/cabecalho/Cabecalho";
import Rodape from "../../components/rodape/rodape";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { http } from "../../App";
import './Diario.css';

export default function Diario() {
    const { day } = useParams();
    const [descricao, setDescricao] = useState('');
    const [feeling, setFeeling] = useState(''); 
    const [dataAtual, setDataAtual] = useState('');
    const [emojiSelecionado, setEmojiSelecionado] = useState('');
    const [mensagem, setMensagem] = useState('');
    const [savedFeelings, setSavedFeelings] = useState([]);
    const { state } = useLocation();
    const [token, setToken] = useState();
    const [id, setId] = useState();
    const navigate = useNavigate();

    useEffect(() => {
        if (!state?.token || !state?.id) {
            navigate("/login");
        } else {
            setToken(state.token);
            setId(state.id);
        }
    }, [setId, setToken, navigate, state]);

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
            if (diaParam && mesParam && anoParam) {
                setDataAtual(`${diaParam.padStart(2, '0')}/${mesParam.padStart(2, '0')}/${anoParam}`);
            } else {
                console.error('', day);
            }
        }
    }, [day]);

    const handleDescricaoChange = (e) => setDescricao(e.target.value);

    const handleEmojiClick = (emoji) => {
        setEmojiSelecionado(emoji);
        setFeeling(emoji); 
    };

    const handleSalvar = () => {
        console.log('feeling:', feeling);
        console.log('descricao:', descricao); // para verificar como está sendo enviada

        if (descricao === '' || emojiSelecionado === '') {
            setMensagem('Por favor, preencha a descrição e selecione um emoji.');
        } else {
            const newEntry = {
                id: Date.now(),
                feeling: feeling,
                description: descricao,
                dataAtual: new Date().toLocaleDateString('pt-BR')
            };
            setSavedFeelings([...savedFeelings, newEntry]);

            http.post(`/register/report/${id}`, {
                feeling: feeling,
                description: descricao
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
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
                setMensagem(error.response.data.msg);
            });
        }
    };

    const handleExcluir = (entryId) => {
        setSavedFeelings(savedFeelings.filter(entry => entry.id !== entryId));
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

                <div className="saved-feelings">
                    {savedFeelings.map((entry) => (
                        <div key={entry.id} className="saved-feeling-item">
                            <span>{entry.feeling} - {entry.dataAtual}</span>
                            <button onClick={() => handleExcluir(entry.id)}>❌</button>
                        </div>
                    ))}
                </div>
            </main>
            <Rodape />
        </>
    );
}
