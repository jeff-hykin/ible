export default `3 Things to know:
1. Column names
- If the name has parentheses, then its effectively read-only.
- Ex: changing the value in (videoDuration) won't somehow actually change the video duration
- When you upload and re-download, those columns will be overwritten with their actual values (ex: the real video duration)

2. Upload Actions
- The uploadAction column can be one of three values: "update", "overwrite", or "delete"
    - "delete" will cause the whole row/entry to be deleted, not just a specific column
    - "update" will try and merge data of that row/entry
        - If all cells that are not empty are considered "new" data
        - If the cell is empty then it preserves what is already in Ible
    - "overwrite" overwrites every single cell for that row/entry, even if the cell is empty
- if two rows have the same observationId, they both get applied top-to-bottom
- Ex: if the bottom one is "delete", then it doesn't matter what the top one is

3. Weird quotes / dashes
- Ible uses Typed CSV https://github.com/jeff-hykin/typed_csv
- An empty cell and a text value with 0 characters WILL BE TREATED DIFFERENTLY
    - NOTE: I'm assuming you're looking at the files with Excel
    - (it looks *very* different if you open the csv with a text editor)
    - What I mean is, if you look at the comment column and see a value of "" 
    - E.g. you can see two quotes in Excel
    - Ible sees a text value with 0 characters, NOT an empty cell
    - If you upload with the "update" action, and its text with 0 characters
        - it will effectively overwrite the existing comment with empty text
    - If you have a totally empty cell, then it will keep whatever comment already exists (if any)
    - There is a much larger system/pattern here
- Basics:
    - "1" + "2" = "12" NOT "3", because those are text values not numbers
    - However, hello and "hello" with quotes, are both 5 characters as far as Ible is concerned
    - There are a handful of exceptions to this:
        - true
        - false
        - null
        - NaN
        - .NaN
        - Infinity
        - +Infinity
        - -Infinity
        - .Inf
        - +.Inf
        - -.Inf
    - Ex: null and "null" are not equal, because null is a special value, and "null" with quotes is text (Ible sees 4 characters)
    - NOTE: captialization doesn't matter (e.g. Null, NULL, True, fAlSe, nan, are all special)
    - If you're uncertain and want text, then use quotes
    - How do you put a quote inside a quote? See the "Advanced" section
- Opening in Excel vs opening in a text editor:
    - "hi" (in Excel) will look like """hi""" in a text editor
    - Why? Because of how CSV handles quotes-inside-of-quotes
    - CSV readers see """hi""" like this:
        - the first quote is the start of the cell
        - the next two quotes combine, and form one quote character
        - then there's the "h" character then the "i" character
        - the next two quotes combine, and form one quote character
        - then the last quote is the end of the cell
- Advanced:
    - If you happen to know what yaml syntax is (https://www.slingacademy.com/article/yaml-syntax-the-complete-cheat-sheet/) good, because typed CSV uses yaml syntax AFTER it deals with CSV escaping.
        - If you open with Excel, then you just need to do the yaml conversion on what you see
        - If you open with a text editor, then you need to BOTH the csv conversion AND the yaml conversion on what you see
        - Read this next section very very very very very slowly and carefully
        - Example 1:
            - in CSV as plaintext, true (4 characters) converts to true (4 characters), e.g. no change
            - then true (4 characters), in yaml, is converted to a boolean value, not a text value
        - Example 2:
            - in CSV "true" (6 characters) converts to true (4 characters), e.g. the quotes are extra
            - then that true (4 characters) in yaml converts to a boolean value, not a text value
        - Example 3:
            - in CSV """true""" (10 characters) converts to "true" (6 characters)
            - then that "true" (6 characters), in yaml, converts to a string of 4 characters (e.g. t,r,u,e) NOT a boolean value
        - Example 4:
            - in CSV "hello,bob" (11 characters) converts to hello,bob (9 characters),
            - hello,bob (9 characters) in yaml, is seen as text with 9 characters
        - Example 5:
            - in Ible, in a comment box, if you type 1,2,3,4 (9 characters)
            - then in yaml it will be "1,2,3,4" (11 characters)
            - and then in csv it will be """1,2,3,4""" (13 characters)
    - Large blocks of text:
        - Back to using Excel
        - If you want to have quotes inside of quotes, you can do this instead:
        |
            they said "hello"
        - In Excel, you'll need to do do 23 keypresses 
        - E.g. *vertical bar* *newline* *space* *space* *space* *space* t h e y *space* s a i d *space* " h e l l o "
        - But when you upload to Ible, it will be a text block of 17 characters. The same as 'they said "hello"'
        - If you see something like:
        |
            blah blah
            blah blah
        - On Ible, that will be a block of text with multiple lines. Similar to "blah blah*newline*blah blah"
        - If you see something like:
        >-
            blah blah
            blah blah
        - That is a *single* line of text "blah blah blah blah" (no newline)
    - Lists:
        - If you see something like:
            - some1@mail.com
            - some2@mail.com
        - Or something like this:
            - "some1@mail.com"
            - "some2@mail.com"
        - Those are lists with blocks of text inside them
        - This is also a list with two pieces of text in it:
            ["some1@mail.com", "some2@mail.com"]
        - Those three lists are all equal
        - This is NOT a list:
            -some1@mail.com
            -some2@mail.com
        - This is a list with ONE item in it:
            - some1@mail.com    - some2@mail.com
        - This is the same list, but different style:
            - "some1@mail.com    - some2@mail.com"
`