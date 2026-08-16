import XCTest
import SwiftTreeSitter
import TreeSitterRenpy

final class TreeSitterRenpyTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_renpy())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading Renpy grammar")
    }
}
