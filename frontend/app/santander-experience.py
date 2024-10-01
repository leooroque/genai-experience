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

    tab1, tab2, tab3 = st.tabs(["Understanding better the lectures 📚", "Agenda creation", "LinkedIn Post Creation"])

    with tab1:
        st.header("Understanding better the lectures")
        col1, col2 = st.columns(2)

        with col1:
            st.subheader("Lecture Summary")
            lectures = get_lectures()
            selected_lecture = st.selectbox("Select a lecture", lectures)

            if st.button("Get Summary", key="summary_button"):
                with st.spinner("Loading summary..."):
                    response = call_api('presentationResume', method='POST', data={"presentation": selected_lecture, "session": random.randint(1, 10000)})
                    if response and response['success']:
                        st.session_state.lecture_summary = response['content']
            
            # Display the lecture summary
            if st.session_state.lecture_summary:
                st.write(st.session_state.lecture_summary)

        with col2:
            st.subheader("Chatbot")
            prompt = st.text_input("What is your question?")
            if st.button("Ask your question", key="ask_button"):
                if prompt:
                    with st.spinner("Thinking..."):
                        response = call_api('llm', method='POST', data={"content": prompt})
                    if response and response['success']:
                        st.write(response['content'])
                else:
                    st.warning("Please enter a question.")

    with tab2:
        st.header("Agenda creation")
        name = st.text_input("Name")
        role = st.text_input("Role")
        interests = st.multiselect("Interests", ["GenAI", "Developer", "Architecture", "Resilience", "Database", "Culture", "Infrastructure"])

        if st.button("Create Agenda"):
            if name and role and interests:
                with st.spinner("Creating agenda..."):
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
                st.warning("Please fill in all fields.")

    with tab3:
        st.header("LinkedIn Post Creation")
        lectures = get_lectures()
        selected_lectures = st.multiselect("Select lectures for the post", lectures)

        # Add checkbox for formal/informal tone
        is_formal = st.checkbox("Formal tone", value=True, help="Check for formal tone, uncheck for informal tone")

        if st.button("Create LinkedIn Post"):
            if selected_lectures:  # Check if any lectures are selected
                with st.spinner("Creating post..."):
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
                st.warning("Please select at least one lecture before creating a post.")

if __name__ == "__main__":
    main()
