import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMapEvents } from 'react-leaflet';
import { Table, Button, Form, Modal } from 'react-bootstrap';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './CercasVirtuais.css';

// Corrigir ícone padrão do Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const CercasVirtuais = () => {
    const [cercas, setCercas] = useState([]);
    const [dispositivos, setDispositivos] = useState([]);
    const [showModal, setShowModal] = useState(false); // Controla o modal de criação/edição
    const [cercaAtual, setCercaAtual] = useState({ id: null, nome: '', raio: '', lat: '', lng: '', dispositivoId: '' });

    // Função para carregar cercas do backend
    const carregarCercasVirtuais = async () => {
        try {
            const resposta = await api.get('/cercas-virtuais');
            setCercas(resposta.data);
        } catch (error) {
            console.error('Erro ao carregar cercas virtuais:', error);
        }
    };

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
        carregarCercasVirtuais();
        carregarDispositivos(); // Carrega a lista de dispositivos ao montar o componente
    }, []);

    const handleShowModal = (cerca = { id: null, nome: '', raio: '', lat: '', lng: '', dispositivoId: '' }) => {
        setCercaAtual(cerca);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setCercaAtual({ id: null, nome: '', raio: '', lat: '', lng: '', dispositivoId: '' });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCercaAtual({ ...cercaAtual, [name]: value });
    };

    const handleSaveCerca = async () => {
        try {
            if (cercaAtual.id) {
                await api.put(`/cercas-virtuais/${cercaAtual.id}`, cercaAtual);
            } else {
                await api.post('/cercas-virtuais', cercaAtual);
            }
            carregarCercasVirtuais();
            handleCloseModal();
        } catch (error) {
            console.error('Erro ao salvar cerca virtual:', error);
        }
    };

    const handleDeleteCerca = async (id) => {
        try {
            await api.delete(`/cercas-virtuais/${id}`);
            carregarCercasVirtuais();
        } catch (error) {
            console.error('Erro ao excluir cerca virtual:', error);
        }
    };

    // Componente para permitir clicar e escolher a posição no mapa
    const LocalizadorDePonto = () => {
        useMapEvents({
            click(e) {
                setCercaAtual((prev) => ({ ...prev, lat: e.latlng.lat, lng: e.latlng.lng }));
            },
        });
        return null;
    };

    return (
        <div className="container">
            <h2>Áreas Monitoradas</h2>
            <Button variant="primary" className="botao-adicionar" onClick={() => handleShowModal()}>Adicionar Nova Cerca</Button>

            <Table striped bordered hover className="tabela">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Dispositivo</th>
                        <th>Raio (m)</th>
                        <th>Localização (Lat, Lng)</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {cercas.map(cerca => (
                        <tr key={cerca.id}>
                            <td>{cerca.id}</td>
                            <td>{cerca.nome}</td>
                            <td>{cerca.Dispositivo ? cerca.Dispositivo.nome : 'Sem dispositivo'}</td>
                            <td>{cerca.raio}</td>
                            <td>{cerca.lat}, {cerca.lng}</td>
                            <td>
                                <Button variant="warning" className="botao" onClick={() => handleShowModal(cerca)}>Editar</Button>
                                <Button variant="danger" onClick={() => handleDeleteCerca(cerca.id)}>Excluir</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Modal de criação/edição */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{cercaAtual.id ? 'Editar Cerca' : 'Cadastrar Cerca'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formNome">
                            <Form.Label className="label-destaque">Nome</Form.Label>
                            <Form.Control
                                type="text"
                                name="nome"
                                value={cercaAtual.nome}
                                onChange={handleChange}
                                placeholder="Digite o nome da cerca"
                                className="input-margin"
                            />
                        </Form.Group>

                        <Form.Group controlId="formLat">
                            <Form.Label className="label-destaque">Latitude</Form.Label>
                            <Form.Control
                                type="text"
                                name="lat"
                                value={cercaAtual.lat}
                                onChange={handleChange}
                                placeholder="Digite a latitude"
                                className="input-margin"
                            />
                        </Form.Group>

                        <Form.Group controlId="formLng">
                            <Form.Label className="label-destaque">Longitude</Form.Label>
                            <Form.Control
                                type="text"
                                name="lng"
                                value={cercaAtual.lng}
                                onChange={handleChange}
                                placeholder="Digite a longitude"
                                className="input-margin"
                            />
                        </Form.Group>

                        <Form.Group controlId="formDispositivo">
                            <Form.Label className="label-destaque">Dispositivo</Form.Label>
                            <Form.Control
                                as="select"
                                name="dispositivoId"
                                className="input-margin"
                                value={cercaAtual.dispositivoId}
                                onChange={handleChange}
                            >
                                <option value="">Selecione um dispositivo</option>
                                {dispositivos.map(dispositivo => (
                                    <option key={dispositivo.id} value={dispositivo.id}>
                                        {dispositivo.nome}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        
                        <Form.Group controlId="formRaio">
                            <Form.Label className="label-destaque">Raio (m)</Form.Label>
                            <Form.Control
                                type="text"
                                name="raio"
                                value={cercaAtual.raio}
                                onChange={handleChange}
                                placeholder="Digite o raio da cerca"
                                className="input-margin"
                            />
                        </Form.Group>

                        {/* Mapa interativo */}
                        <div style={{ height: '300px', width: '100%' }}>
                            <MapContainer
                                center={cercaAtual.lat && cercaAtual.lng ? [cercaAtual.lat, cercaAtual.lng] : [-25.425912003292144, -49.260832179446844]}
                                zoom={11}
                                style={{ height: '100%', width: '100%' }}
                            >
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution="&copy; OpenStreetMap contributors"
                                />
                                {cercaAtual.lat && cercaAtual.lng && (
                                    <>
                                        <Marker position={[cercaAtual.lat, cercaAtual.lng]}>
                                            <Popup>Localização da Cerca</Popup>
                                        </Marker>
                                        <Circle
                                            center={[cercaAtual.lat, cercaAtual.lng]}
                                            radius={cercaAtual.raio} // Raio em metros
                                            pathOptions={{ color: 'blue', fillColor: 'blue', fillOpacity: 0.3 }} // Estilo do círculo
                                        />
                                    </>
                                )}
                                <LocalizadorDePonto />
                            </MapContainer>
                        </div>

                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>Cancelar</Button>
                    <Button variant="primary" onClick={handleSaveCerca}>
                        {cercaAtual.id ? 'Salvar Alterações' : 'Cadastrar'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default CercasVirtuais;
