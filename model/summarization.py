import google.generativeai as genai

API_KEY = 'replace_with_your_api_key'
genai.configure(api_key=API_KEY)

def summarize(reviews):
    text = ""
    for i in reviews:
        text += i
    promt = f"""
    Tóm tắt khai thác các bình luận sau: {text}.
    Output dạng HTML, bao gồm: 
    <h3>Ưu điểm</h3>
    <h3>Nhược điểm</h3>

    """

    model = genai.GenerativeModel('gemini-1.5-flash')

    response = model.generate_content(promt)
    return response.text