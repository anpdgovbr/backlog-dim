CREATE TABLE processamentos (
  id SERIAL PRIMARY KEY,
  responsavel TEXT NOT NULL,
  numero_protocolo INTEGER NOT NULL,
  data_criacao DATE NOT NULL,
  status TEXT NOT NULL,
  tipo_solicitacao TEXT NOT NULL,
  denuncia_anonima BOOLEAN DEFAULT FALSE,
  ticket_solicitante TEXT
);
