import json
import re

def convert_markdown_to_html(markdown_content):
    """
    Markdown 콘텐츠를 HTML 형식으로 변환합니다.
    
    Args:
        markdown_content: 변환할 Markdown 콘텐츠 문자열
    
    Returns:
        HTML 문자열 (JSON 저장 시 ensure_ascii=False로 한글 보존)
    """
    # Markdown을 HTML로 변환
    html_content = markdown_to_html(markdown_content)
    
    return html_content


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


# 메인 실행 부분
if __name__ == "__main__":
    input_content = open('html_input.txt', 'r', encoding='utf-8').read()

    html_content = convert_markdown_to_html(input_content) if input_content.strip() else ""
    json_string = json.dumps(html_content, ensure_ascii=False)

    with open('html_output.txt', 'w', encoding='utf-8') as f:
        f.write(json_string)
