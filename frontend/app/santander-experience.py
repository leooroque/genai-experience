import streamlit as st
import requests
import random
import os

# Function to call API
def call_api(endpoint, method='GET', data=None):
    base_url = os.environ.get('API_BASE_URL', 'http://localhost:3000')
    url = f"{base_url}/api/genai/{endpoint}"
    
    try:
        if method == 'GET':
            response = requests.get(url)
        elif method == 'POST':
            response = requests.post(url, json=data)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        st.error(f"API call failed: {str(e)}")
        return None

# Function to get lectures
def get_lectures():
    response = call_api('getlectures')
    if response and response['success']:
        return [lecture['name'] for lecture in response['content']['lectures']]
    return []

# Main app
def main():
    st.set_page_config(page_title="Santander Experience", layout="wide")
    st.title("Santander Experience")

    # Initialize session state
    if 'lecture_summary' not in st.session_state:
        st.session_state.lecture_summary = ""

    tab1, tab2, tab3 = st.tabs(["Entendendo melhor as palestras 📚", "Criação de agenda", "Exemplos de posts para usar no LinkedIn"])

    with tab1:
        st.header("Entendendo melhor as palestras")
        col1, col2 = st.columns(2)

        with col1:
            st.subheader("Resumir palestras - Bedrock Agents e KB")
            lectures = get_lectures()
            selected_lecture = st.selectbox("Selecione uma palestra", lectures)

            if st.button("Obter resumo", key="summary_button"):
                with st.spinner("Resumindo..."):
                    response = call_api('presentationResume', method='POST', data={"presentation": selected_lecture, "session": random.randint(1, 10000)})
                    if response and response['success']:
                        st.session_state.lecture_summary = response['content']
            
            # Display the lecture summary
            if st.session_state.lecture_summary:
                st.write(st.session_state.lecture_summary)

        with col2:
            st.subheader("Chatbot - Bedrock Flows e Guardrails")
            with st.expander("Perguntas de exemplo"):
                st.write("O que o Werner Vogel fala sobre falhas sistêmicas?")
                st.write("Como instrumentar uma aplicação com ADOT?")
                st.write("O que é melhor ECS ou EKS? - Pergunta barrada no Guardrail (por contexto)")
            prompt = st.text_input("Qual é a sua pergunta? (A resposta será feita de forma didática, como se fosse para uma criança de 10 anos.)")
            if st.button("Faça sua pergunta", key="ask_button"):
                if prompt:
                    with st.spinner("Pensando..."):
                        response = call_api('llm', method='POST', data={"content": prompt})
                    if response and response['success']:
                        st.write(response['content'])
                else:
                    st.warning("Por favor inclua uma pergunta.")

    with tab2:
        st.header("Criação de agenda - Bedrock Agents e Actions Group")
        name = st.text_input("Nome")
        role = st.text_input("Qual sua função? (Desenvolvedor, Arquiteto, etc.)")
        interests = st.multiselect("Quais temas você tem mais interesse?", ["Generative AI", "Desenvolvimento", "Arquitetura", "Resiliência", "Database", "Cultura", "Infraestrutura"])

        if st.button("Create Agenda"):
            if name and role and interests:
                with st.spinner("Criando agenda..."):
                    data = {
                        "content": {
                            "name": name,
                            "role": role,
                            "interests": interests,
                            "session":random.randint(1, 10000)
                        }
                    }
                    response = call_api('agenda', method='POST', data=data)
                    if response and response['success']:
                        st.write(response['content'])
            else:
                st.warning("Por favor preencha os campos.")

    with tab3:
        st.header("Exemplos de posts para usar no LinkedIn -  Bedrock Agents e Prompt Management")
        lectures = get_lectures()
        selected_lectures = st.multiselect("Selecione as palestras que você participou para criar um exemplo de post para o LinkedIn", lectures)

        # Add checkbox for formal/informal tone
        is_formal = st.checkbox("Linguagem formal", value=True, help="Marque para manter uma linguagem formal, desmarque para uma linguagem informal")

        if st.button("Criar exemplo de post"):
            if selected_lectures:  # Check if any lectures are selected
                with st.spinner("Criando post..."):
                    data = {
                        "content": {
                            "lectures": selected_lectures,
                            "tone": "formal" if is_formal else "informal",
                            "session": random.randint(1, 10000)
                        }
                    }

                    # Assuming you have a function to call your API
                    response = call_api('linkedIn', method='POST', data=data)
                    if response and response['success']:
                        st.write(response['content'])
            else:
                st.warning("Por favor selecione pelo menos 1 sessão.")

if __name__ == "__main__":
    main()
