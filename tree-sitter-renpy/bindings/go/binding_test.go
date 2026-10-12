package tree_sitter_renpy_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_renpy "github.com/tree-sitter/tree-sitter-renpy/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_renpy.Language())
	if language == nil {
		t.Errorf("Error loading Renpy grammar")
	}
}
