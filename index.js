let books = localStorage.getItem("books")
? JSON.parse(localStorage.getItem("books"))
: [];

let editingId = null;

window.onload = function()
{
    displayBooks();
};

function saveBooks()
{
    localStorage.setItem("books",JSON.stringify(books));
}

function Book (title, author, pages, read)
{
    this.ID = crypto.randomUUID();

    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;

}


function getInput()
{
        let a = document.getElementById("titleInput").value.trim();
        let b = document.getElementById("authorInput").value.trim();
        let c = parseInt(document.getElementById("pagesInput").value);
        let d = document.getElementById("checkboxInput").checked;

        if (editingId)
        {
            const book = books.find(bk => bk.ID === editingId);
            if (!book) return;

            book.title = a;
            book.author = b;
            book.pages = c;
            book.read = d;

            editingId = null;
        }
        else 
        {
            let book1 = new Book (a, b, c, d);
            books.push(book1);
        }



        

        saveBooks();
        displayBooks();
}

function toggleRead(ID)
{
    const book = books.find(b => b.ID === ID);
    if (!book) return;

    book.read = !book.read;

    saveBooks();
    displayBooks();
}

function searchBooks(query)
{
    const filtered = books.filter(book =>
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query)
    );
    displayBooks(filtered);
}

function editBook(ID)
{
    const card = document.querySelector(`[data-id="${ID}"]`).closest(".bookCard");
    const book = books.find(b => b.ID === ID);
    if (!book || !card) return;

    card.innerHTML = `
    <input type = "text" value = "${book.title}" class = "edit-title">
    <input type = "text" value = "${book.author}" class = "edit-author">
    <input type = "text" value = "${book.pages}" class = "edit-pages">

    <label>
        Read:
        <input type = "checkbox" class = "edit-read" ${book.read ? "checked" : ""}>
    </label>

    <button data-id = "${ID}" class = "save-edit">Save</button>
    <button data-id = "${ID}" class = "cancel-edit">Cancel</button>
    `;

}

function saveEdit(ID, button)
{
    const card = button.closest(".bookCard");
    const book = books.find(b => b.ID === ID);
    if (!book || !card) return;

    const newTitle = card.querySelector(".edit-title").value.trim()
    const newAuthor = card.querySelector(".edit-author").value.trim();
    const newPages = parseInt(card.querySelector(".edit-pages").value);
    const newRead = card.querySelector(".edit-read").checked;

    book.title = newTitle;
    book.author = newAuthor;
    book.pages = newPages;
    book.read = newRead;

    saveBooks();


    card.innerHTML = `
        <div class="bookTitle">${book.title}</div>
        <div class="bookInfo">Author: ${book.author}</div>
        <div class="bookInfo">Pages: ${book.pages}</div>

        <div class="readBadge">
            ${book.read ? "Read" : "Unread"}
        </div>

        <button data-id = "${book.ID}" class = "toggle-read">
        Toggle Read
        </button>

        <button data-id = "${book.ID}" class = "edit-book">
        Edit
        </button>

        <div class="removeButton">
        <button data-id="${book.ID}" class = "removeBook">
            Remove
        </button>
        </div>
        `;

}

function displayBooks(list = books)
{
    let container = document.getElementById("bookList");
    container.innerHTML = "";

    for (let i = 0; i < books.length; i++)
    {
        let book = list[i];

        let div = document.createElement("div");
        div.classList.add("bookCard")

        div.innerHTML = `
        <div class="bookTitle">${book.title}</div>
        <div class="bookInfo">Author: ${book.author}</div>
        <div class="bookInfo">Pages: ${book.pages}</div>

        <div class="readBadge">
            ${book.read ? "Read" : "Unread"}
        </div>

        <div class ="buttonRow">
        <button data-id = "${book.ID}" class = "toggle-read">
        Toggle Read
        </button>

        <button data-id = "${book.ID}" class = "edit-book">
        Edit
        </button>

        
        <button data-id="${book.ID}" class = "removeBook">
            Remove
        </button>
        </div>
        `;
            
        container.appendChild(div);
    }

}

function removeBook(ID) {
    books = books.filter(book => book.ID !== ID); // “Give me everything except the one with this ID”
    saveBooks();
    displayBooks();
}

const btn = document.getElementById("toggleBtn");
const form = document.getElementById("inputField");
const submitBtn = document.getElementById("submitBtn");

btn.addEventListener("click", (e) =>
{
    e.stopPropagation();
    form.classList.toggle("show");
});

document.addEventListener("click", (e) =>
{
    if (!form.contains(e.target) && !btn.contains(e.target))
    {
        form.classList.remove("show");
    }
});

submitBtn.addEventListener("click",getInput);


document.getElementById("bookList").addEventListener("click", (e) => {
    const button = e.target.closest("button");
    if (!button) return;
    const ID = button.dataset.id;
    if(!ID) return;

    if (!ID) return;

    if (e.target.classList.contains("removeBook"))
    {
        removeBook(ID);
    }

    if (e.target.classList.contains("toggle-read"))
    {
        toggleRead(ID);
    }

    if (e.target.classList.contains("edit-book"))
    {
        editBook(ID);
    }
    if(e.target.classList.contains("save-edit"))
    {
        saveEdit(ID, button);
    }
    if(e.target.classList.contains("cancel-edit"))
    {
        displayBooks();
    }

});

const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("input", () =>
{
    const query = searchInput.value.toLowerCase();
    searchBooks(query);
});


