import React from 'react';
import DispositivoList from '../components/DispositivoList';
import CercasVirtuais from '../components/CercasVirtuais';

const Dashboard = () => {
    return (
        <div>
            <h1 className="text-center mt-4">Painel de Controle</h1>
            <DispositivoList />
            <CercasVirtuais />
        </div>
    );
};

export default Dashboard;
