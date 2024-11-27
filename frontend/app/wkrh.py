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

def get_subjects():
    response = call_api('getsubjects')
    if response and response['success']:
        return [lecture['name'] for lecture in response['content']['topics']]
    return []

# Main app
def main():
    st.set_page_config(page_title="Talent Acquisition AWARDS - 2024", layout="wide")
    st.title("Talent Acquisition AWARDS 2024 - Generative AI application powered by Amazon Bedrock")

    # Initialize session state
    if 'lecture_summary' not in st.session_state:
        st.session_state.lecture_summary = ""

    tab1, tab2, tab3 = st.tabs(["Entendendo melhor a palestra", "Analise de perfil vs vagas", "Criação de posts no LinkedIn"])

    with tab1:
        st.header("Entendendo melhor a palestra - tire suas dúvidas")
        st.subheader("Chatbot com Amazon Bedrock Guardrails")
        with st.expander("Perguntas de exemplo"):
            st.write("O que é Generative AI?")
            st.write("O que é inteligencia Artificial?")
            st.write("O que é uma IA responsável?")
        prompt = st.text_input("Qual é a sua pergunta? (A resposta será feita de forma didática, como se fosse para uma criança de 10 anos, com o objetivo de mostrar o poder dos prompts.)")
        if st.button("Faça sua pergunta", key="ask_button"):
            if prompt:
                with st.spinner("Pensando..."):
                        response = call_api('llmrh', method='POST', data={"content": prompt})
                if response and response['success']:
                    if type(response['content']) != str:
                        st.write(response['content']['content'][0]['text'])
                    else:
                        st.write(response['content'])

            else:
                st.warning("Por favor inclua uma pergunta.")

    with tab2:
        st.header("Perfil vs Vaga")
        
        # Job type selection
        job_types = ["fullstack", "analytics", "support"]
        selected_job = st.selectbox("Selecione o perfil para analise", job_types)
        
        if st.button("Detalhes de um CV fictício"):
            #cv_details = get_cv_details(selected_job)
            data = {"content": selected_job}
            cv_details = call_api('getCVDEtails', method='POST', data=data)
            st.session_state.cv_details = cv_details['content']
            st.text_area("CV Details", value=cv_details['content'], height=200)
        
        if st.button("Avaliar vagas"):
            if 'cv_details' in st.session_state:
                with st.spinner('Analisando vagas disponiveis para o perfil...'):
                    _data = {"content": {"cv": st.session_state.cv_details,"session":123}}
                    evaluation = call_api('checkCV', method='POST', data=_data)
                    st.text_area("Avaliação entre perfil e vagas", value=evaluation['content'], height=200)
            else:
                st.warning("Selecione o perfil de profissional")

    with tab3:
        st.header("Criando posts para usar no LinkedIn")
        #lectures = get_lectures()
        lectures = get_subjects()
        selected_lectures = st.multiselect("Selecione os tópicos para criar um exemplo de post para o LinkedIn", lectures)

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
                    response = call_api('linkedInRH', method='POST', data=data)
                    if response and response['success']:
                        st.write(response['content']['content'][0]['text'])
            else:
                st.warning("Por favor selecione pelo menos 1 tópico.")

if __name__ == "__main__":
    main()
