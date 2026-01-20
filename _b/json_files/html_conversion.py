import json
import re
from datetime import datetime

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


def create_json_entry(html_content, title="Learning Logic Improves Decision-Making", 
                     category="Research", date=None):
    """
    JSON 엔트리를 생성합니다.
    
    Args:
        html_content: HTML 콘텐츠 (원본 HTML 문자열)
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
        # Markdown을 HTML로 변환
        html_content = convert_markdown_to_html(input_content)
        
        # JSON 엔트리 생성
        json_entry = create_json_entry(
            html_content,
            title="Learning Logic Improves Decision-Making",
            category="Research",
            date="2026-01-20"
        )
        
        # 기존 research.json 파일 읽기
        try:
            with open('research.json', 'r', encoding='utf-8') as f:
                existing_data = json.load(f)
        except FileNotFoundError:
            existing_data = []
        except json.JSONDecodeError:
            print("경고: research.json 파일을 파싱할 수 없습니다. 새로 생성합니다.")
            existing_data = []
        
        # 중복 체크 및 업데이트 (title로 중복 확인)
        entry_title = json_entry.get('title')
        entry_updated = False
        
        for i, existing_entry in enumerate(existing_data):
            if existing_entry.get('title') == entry_title:
                # 중복 발견: 기존 엔트리 덮어쓰기
                existing_data[i] = json_entry
                entry_updated = True
                print(f"기존 엔트리 업데이트: '{entry_title}'")
                break
        
        # 중복이 없으면 새로 추가
        if not entry_updated:
            existing_data.append(json_entry)
            print(f"새 엔트리 추가: '{entry_title}'")
        
        # research.json 파일에 저장 (ensure_ascii=False로 한글 보존)
        json_output = json.dumps(existing_data, indent=4, ensure_ascii=False)
        with open('research.json', 'w', encoding='utf-8') as f:
            f.write(json_output)
        
        print(f"\n변환 완료! research.json 파일에 저장되었습니다.")
        print(f"총 {len(existing_data)}개의 엔트리가 있습니다.")
        print(f"\n변환된 HTML (처음 300자):\n{html_content[:300]}...")
        
        # JSON 엔트리 확인
        print("\n=== JSON 엔트리 구조 ===")
        print(json.dumps(json_entry, indent=2, ensure_ascii=False))
        
    else:
        print("html_input.txt에 내용을 입력해주세요.")
