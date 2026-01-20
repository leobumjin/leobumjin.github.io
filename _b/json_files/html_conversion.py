import json
import re
from datetime import datetime

def convert_markdown_to_html_json(markdown_content):
    """
    Markdown 콘텐츠를 HTML 형식으로 변환하고 JSON 문자열로 이스케이프 처리합니다.
    
    json.dumps()가 자동으로 다음을 이스케이프 처리합니다:
    - 큰따옴표 (") → \"
    - 백슬래시 (\) → \\
    - 줄바꿈 (\n) → \\n
    - 탭 (\t) → \\t
    - 기타 제어 문자들
    
    Args:
        markdown_content: 변환할 Markdown 콘텐츠 문자열
    
    Returns:
        JSON 이스케이프 처리된 HTML 문자열 (큰따옴표로 감싸진 형태)
    """
    # Markdown을 HTML로 변환
    html_content = markdown_to_html(markdown_content)
    
    # JSON 이스케이프 처리
    # json.dumps()는 자동으로 큰따옴표, 백슬래시 등을 이스케이프 처리합니다
    # 결과는 큰따옴표로 감싸진 JSON 문자열이 됩니다
    json_string = json.dumps(html_content)
    
    return json_string


def markdown_to_html(markdown_text):
    """
    Markdown 텍스트를 HTML로 변환합니다.
    """
    html = markdown_text
    
    # 헤더 변환 (## -> <h2>)
    html = re.sub(r'^## (.+)$', r'<h2>\1</h2>', html, flags=re.MULTILINE)
    
    # 코드 블록 변환 (```...``` -> <pre><code>...</code></pre>)
    html = re.sub(
        r'```([^`]+)```',
        lambda m: f'<pre><code>{m.group(1).strip()}</code></pre>',
        html,
        flags=re.DOTALL
    )
    
    # 인라인 코드 변환 (`...` -> <code>...</code>)
    html = re.sub(r'`([^`]+)`', r'<code>\1</code>', html)
    
    # 이미지 태그는 그대로 유지 (이미 HTML 형식)
    # <img src="..." ... /> 형태는 그대로 유지
    
    # 리스트 항목 변환 (- -> <li>)
    html = re.sub(r'^- (.+)$', r'<li>\1</li>', html, flags=re.MULTILINE)
    
    # 연속된 <li>를 <ul>로 감싸기
    html = re.sub(
        r'(<li>.*?</li>(?:\s*<li>.*?</li>)*)',
        lambda m: f'<ul>{m.group(1)}</ul>',
        html,
        flags=re.DOTALL
    )
    
    # 단락 변환 (빈 줄로 구분된 텍스트 블록을 <p>로 감싸기)
    # 이미 태그로 감싸진 부분은 제외
    lines = html.split('\n')
    result_lines = []
    current_paragraph = []
    
    for line in lines:
        stripped = line.strip()
        if not stripped:
            if current_paragraph:
                para_text = ' '.join(current_paragraph)
                if not para_text.startswith('<'):
                    result_lines.append(f'<p>{para_text}</p>')
                else:
                    result_lines.append(para_text)
                current_paragraph = []
            result_lines.append('')
        elif stripped.startswith('<'):
            if current_paragraph:
                para_text = ' '.join(current_paragraph)
                if not para_text.startswith('<'):
                    result_lines.append(f'<p>{para_text}</p>')
                else:
                    result_lines.append(para_text)
                current_paragraph = []
            result_lines.append(line)
        else:
            current_paragraph.append(stripped)
    
    if current_paragraph:
        para_text = ' '.join(current_paragraph)
        if not para_text.startswith('<'):
            result_lines.append(f'<p>{para_text}</p>')
        else:
            result_lines.append(para_text)
    
    html = '\n'.join(result_lines)
    
    # 빈 줄 정리
    html = re.sub(r'\n{3,}', '\n\n', html)
    
    return html.strip()


def create_json_entry(html_content, title="Learning Logic Improves Decision-Making", 
                     category="Research", date=None):
    """
    JSON 엔트리를 생성합니다.
    
    Args:
        html_content: HTML 콘텐츠 (이미 JSON 이스케이프 처리된 문자열)
        title: 제목
        category: 카테고리
        date: 날짜 (YYYY-MM-DD 형식, None이면 오늘 날짜)
    
    Returns:
        JSON 엔트리 딕셔너리
    """
    if date is None:
        date = datetime.now().strftime("%Y-%m-%d")
    
    entry = {
        "date": date,
        "title": title,
        "category": category,
        "copy_counter": 0,
        "html": html_content
    }
    
    return entry


# 메인 실행 부분
if __name__ == "__main__":
    # 입력 파일 읽기
    try:
        with open('html_input.txt', 'r', encoding='utf-8') as f:
            input_content = f.read()
    except FileNotFoundError:
        print("html_input.txt 파일을 찾을 수 없습니다.")
        exit(1)
    
    # 변환 실행
    if input_content.strip():
        # Markdown을 HTML로 변환하고 JSON 문자열로 이스케이프 처리
        html_json_string = convert_markdown_to_html_json(input_content)
        
        # JSON 엔트리 생성
        json_entry = create_json_entry(
            html_json_string,
            title="Learning Logic Improves Decision-Making",
            category="Research",
            date="2026-01-20"
        )
        
        # JSON 배열로 변환
        json_array = [json_entry]
        json_output = json.dumps(json_array, indent=4, ensure_ascii=False)
        
        # 출력 파일로 저장
        with open('html_output.json', 'w', encoding='utf-8') as f:
            f.write(json_output)
        
        print("변환 완료! html_output.json 파일에 저장되었습니다.")
        print(f"\n변환된 HTML (처음 300자):\n{html_json_string[:300]}...")
        
        # JSON 엔트리 확인
        print("\n=== JSON 엔트리 구조 ===")
        print(json.dumps(json_entry, indent=2, ensure_ascii=False))
        
    else:
        print("html_input.txt에 내용을 입력해주세요.")
