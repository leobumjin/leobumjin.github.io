import json

def convert_python_to_html_json(python_code):
    """
    Python 코드를 HTML 형식으로 변환하고 JSON 문자열로 이스케이프 처리합니다.
    
    json.dumps()가 자동으로 다음을 이스케이프 처리합니다:
    - 큰따옴표 (") → \"
    - 백슬래시 (\) → \\
    - 줄바꿈 (\n) → \\n
    - 탭 (\t) → \\t
    - 기타 제어 문자들
    
    Args:
        python_code: 변환할 Python 코드 문자열
    
    Returns:
        JSON 이스케이프 처리된 HTML 문자열 (큰따옴표로 감싸진 형태)
        예: "<pre><code>print(\\"Hello\\")</code></pre>"
    """
    # 코드 앞뒤 공백 제거
    code = python_code.strip()
    
    # HTML 형식으로 감싸기
    html_code = f"<pre><code>{code}</code></pre>"
    
    # JSON 이스케이프 처리
    # json.dumps()는 자동으로 큰따옴표, 백슬래시 등을 이스케이프 처리합니다
    # 결과는 큰따옴표로 감싸진 JSON 문자열이 됩니다
    json_string = json.dumps(html_code)
    
    return json_string


input_code=open('code_json_input.txt', 'r', encoding='utf-8').read()

# 변환 실행
if input_code.strip():
    output_code = convert_python_to_html_json(input_code)
    
    # txt 파일로 저장
    with open('code_output_code.txt', 'w', encoding='utf-8') as f:
        f.write(output_code)
    
    print("변환 완료! output_code.txt 파일에 저장되었습니다.")
    print(f"\n변환된 코드 (처음 200자):\n{output_code[:200]}...")
    
    # 이스케이프 처리 확인 예제
    print("\n=== 이스케이프 처리 확인 ===")
    test_code = 'print("Hello World")'
    test_result = convert_python_to_html_json(test_code)
    print(f"원본 코드: {test_code}")
    print(f"변환 결과: {test_result}")
    print("→ 큰따옴표가 \\\"로 자동 이스케이프 처리되었습니다!")
else:
    print("input_code에 코드를 입력해주세요.")