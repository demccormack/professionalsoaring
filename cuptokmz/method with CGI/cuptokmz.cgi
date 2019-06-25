#! /usr/bin/python3
import cgi

def htmlTop():
    print(
        """Content-type:text/html\n\n
        <html>
            <head>
                <title>Professional Soaring</title>
                <link rel="stylesheet" href="../stylesheet.css">
            </head>
            <body>
                <h1>CUP to KMZ Converter</h1>"""
    )

def htmlTail():
    print("""</body>
        </html>""")

#main program
if __name__ == "__main__":
    try:
        htmlTop()
        print("You submitted the following data:")
        
        form = cgi.FieldStorage()
        print(form["myFile"].value)
        

        htmlTail()
    except:
        cgi.print_exception()