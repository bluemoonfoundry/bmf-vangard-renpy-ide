PANDOC?=~/Development/pandoc-3.9.0.2-arm64/bin/pandoc
INPUT=TITLE_PAGE.md USER_GUIDE.md
OUTPUT=Ren-IDE_User_Guide.pdf
HTML_OUTPUT=Ren-IDE_User_Guide.html

PANDOC_OPTIONS=--pdf-engine=xelatex \
  --toc \
  --toc-depth=3 \
  --number-sections \
  --highlight-style=tango \
  --variable geometry:margin=1in \
  --variable fontsize=11pt \
  --variable linestretch=1.2 \
  --variable documentclass=report \
  --variable linkcolor=blue \
  --variable urlcolor=blue \
  --variable toccolor=blue \
  --standalone \
  --verbose

HTML_OPTIONS=--toc \
  --toc-depth=3 \
  --number-sections \
  --syntax-highlighting=tango \
  --embed-resources \
  --standalone \
  --metadata title="Ren'IDE User Guide" \
  --css=user-guide.css

.PHONY: all clean pdf draft test html help

all: pdf html

pdf:
	@echo "Generating final PDF with title page..."
	$(PANDOC) $(INPUT) -o $(OUTPUT) $(PANDOC_OPTIONS)
	@echo "✓ PDF generated: $(OUTPUT)"

html:
	@echo "Generating HTML user guide..."
	$(PANDOC) USER_GUIDE.md -o $(HTML_OUTPUT) $(HTML_OPTIONS)
	@echo "✓ HTML generated: $(HTML_OUTPUT)"

draft:
	@echo "Generating draft PDF (no title page)..."
	$(PANDOC) USER_GUIDE.md -o Ren-IDE_User_Guide_DRAFT.pdf --toc --number-sections
	@echo "✓ Draft PDF generated: Ren-IDE_User_Guide_DRAFT.pdf"

test:
	@echo "Generating test PDF (minimal options)..."
	$(PANDOC) USER_GUIDE.md -o test.pdf --toc
	@echo "✓ Test PDF generated: test.pdf"

clean:
	@echo "Cleaning generated files..."
	rm -f $(OUTPUT) $(HTML_OUTPUT) Ren-IDE_User_Guide_DRAFT.pdf test.pdf
	rm -f *.aux *.log *.out *.tex *.toc
	@echo "✓ Clean complete"

help:
	@echo "Ren'IDE User Guide - Makefile targets:"
	@echo ""
	@echo "  make all    - Generate PDF and HTML (default)"
	@echo "  make pdf    - Generate final PDF with title page"
	@echo "  make html   - Generate HTML user guide for bundling with app"
	@echo "  make draft  - Generate draft PDF (no title page, basic formatting)"
	@echo "  make test   - Generate test PDF (minimal options for quick testing)"
	@echo "  make clean  - Remove all generated files"
	@echo "  make help   - Show this help message"
	@echo ""
	@echo "Generated files:"
	@echo "  PDF: $(OUTPUT)"
	@echo "  HTML: $(HTML_OUTPUT)"
