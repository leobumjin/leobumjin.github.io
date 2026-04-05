module RelativeImgSrcRewriter
  ABSOLUTE_SRC_PATTERN = /\A(?:[a-z]+:)?\/\//i
  SKIP_PREFIX_PATTERN = /\A(?:\/|\.{1,2}\/|#|data:)/i

  def rewrite_relative_img_src(html, base_path)
    content = html.to_s
    base = base_path.to_s.strip.sub(%r{/+\z}, "")
    return content if content.empty? || base.empty?

    content.gsub(/<img\b([^>]*?)\bsrc=(["'])(.*?)\2([^>]*)>/i) do |match|
      before = Regexp.last_match(1)
      quote = Regexp.last_match(2)
      src = Regexp.last_match(3).to_s.strip
      after = Regexp.last_match(4)

      if src.empty? || src.match?(ABSOLUTE_SRC_PATTERN) || src.match?(SKIP_PREFIX_PATTERN)
        match
      else
        normalized_src = src.sub(%r{\A/+}, "")
        %(<img#{before}src=#{quote}#{base}/#{normalized_src}#{quote}#{after}>)
      end
    end
  end
end

Liquid::Template.register_filter(RelativeImgSrcRewriter)
