$(document).ready(function() {
    let booksJSON = []; // Store the JSON data
    let uniqueGenres = new Set();
    let uniqueAuthors = new Set();
    
    // Load XML data using $.ajax()
    $.ajax({
        url: 'books.xml',
        dataType: 'xml',
        success: function(xml) {
            parseXMLToJSON(xml);
        },
        error: function(xhr, status, error) {
            $('#status').text('Error: XML file nahi mil rahi: ' + error);
            $('#bookTableBody').html('<tr><td colspan="5" class="loading">Maaf kijiye, books load nahi ho paayi.</td></tr>');
        }
    });
    
    // Parse XML to JSON
    function parseXMLToJSON(xml) {
        $(xml).find('book').each(function() {
            // Note: XML mein title aur author ab Latin script (Hinglish) mein hain
            const book = {
                id: $(this).attr('id'),
                title: $(this).find('title').text(),
                author: $(this).find('author').text(),
                genre: $(this).find('genre').text(),
                // Price ab already Rupees mein convert ho chuka hai XML mein
                price: parseFloat($(this).find('price').text()),
                publication_date: $(this).find('publication_date').text()
            };
            
            booksJSON.push(book);
            uniqueGenres.add(book.genre);
            uniqueAuthors.add(book.author);
        });
        
        populateFilters();
        filterAndDisplayBooks();
        
        $('#status').text('Shabaash! ' + booksJSON.length + ' kitabein load ho gayi hain.');
    }
    
    function populateFilters() {
        const genreSelect = $('#genreFilter');
        [...uniqueGenres].sort().forEach(genre => {
            genreSelect.append($('<option>', { value: genre, text: genre }));
        });
        
        const authorSelect = $('#authorFilter');
        [...uniqueAuthors].sort().forEach(author => {
            authorSelect.append($('<option>', { value: author, text: author }));
        });
    }
    
    function filterBooks() {
        const selectedGenre = $('#genreFilter').val();
        const selectedAuthor = $('#authorFilter').val();
        const minPrice = parseFloat($('#minPrice').val()) || 0;
        const maxPrice = parseFloat($('#maxPrice').val()) || Infinity;
        
        return booksJSON.filter(book => {
            if (selectedGenre !== 'all' && book.genre !== selectedGenre) return false;
            if (selectedAuthor !== 'all' && book.author !== selectedAuthor) return false;
            if (book.price < minPrice || book.price > maxPrice) return false;
            return true;
        });
    }
    
    function filterAndDisplayBooks() {
        const filteredBooks = filterBooks();
        const tbody = $('#bookTableBody');
        
        if (filteredBooks.length === 0) {
            tbody.html('<tr><td colspan="5" class="loading">Aapki filters ke hisaab se koi kitab nahi mili.</td></tr>');
        } else {
            let html = '';
            filteredBooks.forEach(book => {
                html += '<tr>' +
                    '<td>' + escapeHtml(book.title) + '</td>' +
                    '<td>' + escapeHtml(book.author) + '</td>' +
                    '<td>' + escapeHtml(book.genre) + '</td>' +
                    // Displaying price with ₹ symbol
                    '<td>₹' + book.price.toLocaleString('en-IN') + '</td>' +
                    '<td>' + escapeHtml(book.publication_date) + '</td>' +
                    '</tr>';
            });
            tbody.html(html);
        }
        
        $('#status').text('📊 ' + booksJSON.length + ' mein se ' + filteredBooks.length + ' kitabein dikh rahi hain.');
    }
    
    function escapeHtml(text) {
        return String(text)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
    
    // Event listeners
    $('#genreFilter, #authorFilter').on('change', filterAndDisplayBooks);
    $('#minPrice, #maxPrice').on('input', filterAndDisplayBooks);
});