# Alert System 📬

---

https://github.com/user-attachments/assets/d3393df8-ee40-43bb-ac14-40bd7c430b4b

---

## Visão Geral 📝

Sistema completo de monitoramento de sensores com alertas por email. O sistema monitora continuamente leituras de sensores (CPU, RAM, Temperatura, Potência) e envia notificações quando limites configurados são ultrapassados.

---

## Ferramentas 🚀

**Vite**

**TypeScript**

**React**

**shadcn-ui**

**Tailwind CSS**

---

## Estruturação 🧱

```
    index.html - HTML entry point
    vite.config.ts - Vite configuration file
    tailwind.config.js - Tailwind CSS configuration file
    package.json - NPM dependencies and scripts
    src/app.tsx - Root component of the project
    src/main.tsx - Project entry point
    src/index.css - Existing CSS configuration
    src/pages/Index.tsx - Home page logic
```

---

## Arquitetura 🏭

<img alt="Arquitetura" height="506px" width="900px" src="https://i.ibb.co/08D7CQ6/arquitetura-mermaid.png">

---

## Preparação ✏️
1. Pré-requisitos
Node.js 18+ e pnpm
Python 3.8+
Conta no EmailJS (https://www.emailjs.com/)

2. Configurar EmailJS
- Adicione serviço de email (Gmail, Outlook, etc.)
- Crie um template de email com os seguintes parâmetros:
    ```
        to_email: Email do destinatário
        subject: Assunto do email
        message: Corpo da mensagem
    ```
Anote: Service ID, Template ID, Public Key, Secret Key
Ative o uso da API para aplicações `non-browser` em `Account->Security`

3. Configuração do Alert System
`config.py`
- Defina o caminho do seu banco de dados a ser utilizado
- Adicione os `ids` e `keys` do seu EmailJS
- Defina intervalo de verificação e busca de leitura recentes

4. Configuração do Alert Monitor
`alert_monitor.py`
- Faça as alterações necessárias no monitor para adequá-lo ao seu banco de dados

### Dependências 📦
**Frontend**
- Instale dependências
`pnpm i` e/ou `pnpm install`

**Backend**
- Crie o Ambiente Virtual
```
    python -m venv nome_do_ambiente
    .\nome_do_ambiente\Scripts\Activate.ps1
```
- Instale dependências
```
    cd backend
    pip install -r requirements.txt
```

### Como Usar 🛠️
1. Abra três terminais (dois com ambiente virtual ativado na pasta `backend` e o outro no diretório raiz do repositório)
- Primeiro terminal execute o Backend
    ```
        python app.py
    ```
- Segundo terminal execute o Monitor
    ```
        python alert_monitor.py
    ```
- Terceiro terminal execute o Frontend
    ```
        pnpm run dev
    ```

#### Dicas 🧩
Adicione estilização global em `src/index.css` ou crie novos arquivos CSS conforme precisar.

Use classes Tailwind para estilizar componentes.

Customize o UI modificando a configuração Tailwind (`tailwind.config.ts`)
