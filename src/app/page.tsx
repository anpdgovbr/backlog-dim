import GovBRAvatar from '@/components/GovBRAvatar'

export default function HomePage() {
  return (
    <main className="container">
      <h1 className="br-heading">Título Estilizado com GovBR DS</h1>

      <i
        className="fas fa-caret-down"
        style={{ height: '32px', width: '32px', color: 'black' }}
      ></i>
      <i className="fas fa-caret-up"></i>
      <button className="br-button primary">Botão Primário</button>
      <GovBRAvatar
        userName="Fulano"
        userImage="/govbr-ds/images/avatar.png"
        menuItems={[
          { label: 'Meu Perfil', href: '/perfil' },
          { label: 'Configurações do Perfil', href: '/configuracoes' },
          { label: 'Sair', href: '/logout' }
        ]}
      />
    </main>
  )
}
