import React, { useState } from 'react';
import { Plus, Users, Vote } from 'lucide-react';
import { useStore } from '../store/useStore';
import { motion } from 'framer-motion';

import toast from 'react-hot-toast';

export function AdminPanel() {
  const [newCandidate, setNewCandidate] = useState({
    name: '',
    number: '',
    position: 'personeria',
    photoUrl: '',
  });

  const { candidates, addCandidate, isVotingOpen, toggleVoting } = useStore();

  const handleAddCandidate = (e) => {
    e.preventDefault();
    addCandidate({
      ...newCandidate,
      number: parseInt(newCandidate.number),
    });
    toast.success('Candidato agregado exitosamente');
    setNewCandidate({
      name: '',
      number: '',
      position: 'personeria',
      photoUrl: '',
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Total Candidatos</h3>
              <p className="text-3xl font-bold text-blue-600">{candidates.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Vote className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Estado de Votación</h3>
              <p className="text-3xl font-bold text-green-600">
                {isVotingOpen ? 'Abierta' : 'Cerrada'}
              </p>
            </div>
          </div>
          <Button
            variant={isVotingOpen ? "danger" : "success"}
            onClick={toggleVoting}
            className="w-full mt-4"
          >
            {isVotingOpen ? 'Cerrar Votación' : 'Abrir Votación'}
          </Button>
        </Card>
      </div>

      <Card className="mb-8">
        <form onSubmit={handleAddCandidate} className="space-y-6">
          <h2 className="text-2xl font-bold mb-6">Agregar Nuevo Candidato</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Nombre</label>
              <input
                type="text"
                value={newCandidate.name}
                onChange={(e) => setNewCandidate({ ...newCandidate, name: e.target.value })}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Número</label>
              <input
                type="number"
                value={newCandidate.number}
                onChange={(e) => setNewCandidate({ ...newCandidate, number: e.target.value })}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Cargo</label>
              <select
                value={newCandidate.position}
                onChange={(e) => setNewCandidate({ ...newCandidate, position: e.target.value })}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="personeria">Personería</option>
                <option value="contraloria">Contraloría</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">URL de la foto</label>
              <input
                type="url"
                value={newCandidate.photoUrl}
                onChange={(e) => setNewCandidate({ ...newCandidate, photoUrl: e.target.value })}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>
          <Button type="submit" className="w-full md:w-auto">
            <Plus className="w-5 h-5 mr-2" />
            Agregar Candidato
          </Button>
        </form>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {candidates.map((candidate) => (
          <motion.div
            key={candidate.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <img
              src={candidate.photoUrl}
              alt={candidate.name}
              className="w-full h-35 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">{candidate.name}</h3>
              <div className="space-y-2">
                <p className="text-gray-600">Número: {candidate.number}</p>
                <p className="text-gray-600">Cargo: {candidate.position}</p>
                <p className="text-gray-600">Votos actuales: {candidate.votes}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
