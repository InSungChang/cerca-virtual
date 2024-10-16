import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Table, Button, Form, Modal } from 'react-bootstrap';
import './CercasVirtuais.css';

const DispositivoList = () => {
    const [dispositivos, setDispositivos] = useState([]);
    const [showModal, setShowModal] = useState(false); // Controla o modal de criação/edição
    const [dispositivoAtual, setDispositivoAtual] = useState({ id: null, nome: '', imei: '', status: '', localizacao_atual: '' });

    // Função para carregar dispositivos do backend
    const carregarDispositivos = async () => {
        try {
            const resposta = await api.get('/dispositivos');
            setDispositivos(resposta.data);
        } catch (error) {
            console.error('Erro ao carregar dispositivos:', error);
        }
    };

    useEffect(() => {
        carregarDispositivos();
    }, []);

    // Função para lidar com a abertura do modal (cadastrar ou editar)
    const handleShowModal = (dispositivo = { id: null, nome: '', imei: '', status: '', localizacao_atual: '' }) => {
        setDispositivoAtual(dispositivo);
        setShowModal(true);
    };
    
    // Função para lidar com o fechamento do modal
    const handleCloseModal = () => {
        setShowModal(false);
        setDispositivoAtual({ id: null, nome: '', imei: '', status: '', localizacao_atual: '' });
    };    

    // Função para lidar com a alteração dos campos no formulário
    const handleChange = (e) => {
        const { name, value } = e.target;
        setDispositivoAtual({ ...dispositivoAtual, [name]: value });
    };

    // Função para salvar um novo dispositivo ou editar um existente
    const handleSaveDispositivo = async () => {
        try {
            if (dispositivoAtual.id) {
                // Editar dispositivo existente
                await api.put(`/dispositivos/${dispositivoAtual.id}`, dispositivoAtual);
            } else {
                // Cadastrar novo dispositivo
                await api.post('/dispositivos', dispositivoAtual);
            }
            carregarDispositivos(); // Recarregar a lista
            handleCloseModal(); // Fechar o modal
        } catch (error) {
            console.error('Erro ao salvar dispositivo:', error);
        }
    };

    // Função para excluir um dispositivo
    const handleDeleteDispositivo = async (id) => {
        try {
            await api.delete(`/dispositivos/${id}`);
            carregarDispositivos(); // Recarregar a lista
        } catch (error) {
            console.error('Erro ao excluir dispositivo:', error);
        }
    };

    return (
        <div className="container">
            <h2>Dispositivos:</h2>
            <Button variant="primary" className='botao-adicionar' onClick={() => handleShowModal()}>Adicionar Novo Dispositivo</Button>

            <Table striped bordered hover className="tabela">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>IMEI</th>
                        <th>Status</th>
                        <th>Localização Atual</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {dispositivos.map(dispositivo => (
                        <tr key={dispositivo.id}>
                            <td>{dispositivo.id}</td>
                            <td>{dispositivo.nome}</td>
                            <td>{dispositivo.imei}</td>
                            <td>{dispositivo.status === 'ativo' ? 'Ativo' : 'Inativo'}</td>
                            <td>{dispositivo.localizacao_atual || 'Indisponível'}</td>
                            <td>
                                <Button variant="warning" className="botao" onClick={() => handleShowModal(dispositivo)}>Editar</Button>
                                <Button variant="danger" onClick={() => handleDeleteDispositivo(dispositivo.id)}>Excluir</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Modal de criação/edição */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{dispositivoAtual.id ? 'Editar Dispositivo' : 'Cadastrar Dispositivo'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formNome">
                            <Form.Label className="label-destaque">Nome</Form.Label>
                            <Form.Control
                                type="text"
                                name="nome"
                                value={dispositivoAtual.nome}
                                onChange={handleChange}
                                placeholder="Digite o nome do dispositivo"
                                className="input-margin"
                            />
                        </Form.Group>

                        <Form.Group controlId="formIMEI">
                            <Form.Label className="label-destaque">IMEI</Form.Label>
                            <Form.Control
                                type="text"
                                name="imei"
                                value={dispositivoAtual.imei}
                                onChange={handleChange}
                                placeholder="Digite o IMEI"
                                className="input-margin"
                            />
                        </Form.Group>

                        <Form.Group controlId="formStatus">
                            <Form.Label className="label-destaque">Status</Form.Label>
                            <Form.Control
                                as="select" // Altere para um select
                                name="status"
                                className="input-margin"
                                value={dispositivoAtual.status}
                                onChange={handleChange}
                            >
                                <option value="ativo">Ativo</option>
                                <option value="inativo">Inativo</option>
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId="formLocalizacaoAtual">
                            <Form.Label className="label-destaque">Localização Atual</Form.Label>
                            <Form.Control
                                type="text"
                                name="localizacao_atual"
                                value={dispositivoAtual.localizacao_atual}
                                onChange={handleChange}
                                placeholder="Digite a localização atual"
                                className="input-margin"
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>Cancelar</Button>
                    <Button variant="primary" onClick={handleSaveDispositivo}>
                        {dispositivoAtual.id ? 'Salvar Alterações' : 'Cadastrar'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default DispositivoList;