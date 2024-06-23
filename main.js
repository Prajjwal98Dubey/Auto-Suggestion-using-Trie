const inp = document.getElementById("inp");
const suggest = document.getElementsByClassName("suggest")[0];
class TrieNode {
    constructor() {
        this.children = new Map();
        this.endOfWord = false;
    }
}
class Trie {
    constructor() {
        this.root = new TrieNode();
    }
    insertWord(word) {
        let curr = this.root
        for (let i = 0; i < word.length; i++) {
            if (curr.children.has(word.charAt(i))) {
                curr = curr.children.get(word.charAt(i));
            }
            else {
                let newTrieNode = new TrieNode();
                curr.children.set(word.charAt(i), newTrieNode);
                curr = curr.children.get(word.charAt(i))

            }
        }
        curr.endOfWord = true;
    }
    isWordPresent(word) {
        let curr = this.root
        for (let i = 0; i < word.length; i++) {
            if (!curr.children.has(word.charAt(i))) {
                return false;
            }
            else {
                curr = curr.children.get(word.charAt(i))

            }
        }
        return curr.endOfWord ? true : false;

    }
    isPrefixPresent(word) {
        let curr = this.root
        for (let i = 0; i < word.length; i++) {
            if (!curr.children.has(word.charAt(i))) {
                return false;
            }
            else {
                curr = curr.children.get(word.charAt(i))

            }
        }
        return true;
    }
    autoSuggest(word) {
        let curr = this.root
        for (let i = 0; i < word.length; i++) {
            if (!curr.children.get(word.charAt(i))) return "";
            else {
                curr = curr.children.get(word.charAt(i));
            }

        }
        let collections = [];
        function cb(val, key, map) {
            collections.push(key);
        }
        curr.children.forEach(cb)
        return collections;
    }
}

let trie = new Trie();
async function fetchWords() {
    const data = await fetch('https://random-word-api.herokuapp.com/all').then((res) => res.json()).then((data) => {
        for (let i = 0; i < data.length; i++) {
            trie.insertWord(data[i]);
        }
    })
}
const fetchFromLocalStorage = () => {
    if (localStorage.getItem("autosuggest-devil")) {
        let words = JSON.parse(localStorage.getItem("autosuggest-devil"));
        for (let i = 0; i < words.length; i++) {
            trie.insertWord(words[i]);
        }
    }
}
fetchWords();
fetchFromLocalStorage();

let trimAllWhiteSpaces = (s) => {
    let res = ""
    for (let i = 0; i < s.length; i++) {
        if (s.charAt(i) != " ") res += s.charAt(i);
    }
    return res
}

inp.addEventListener('input', (e) => {
    if (e.target.value != "" && e.target.value.trim().length >= 1) {
        let s = trimAllWhiteSpaces(e.target.value)
        suggest.innerHTML = '';
        let returnedValue = trie.autoSuggest(s);
        if (typeof returnedValue != 'string' && returnedValue.length) {
            for (let i = 0; i < returnedValue.length; i++) {
                const liElement = document.createElement('li');
                liElement.textContent = s + returnedValue[i];
                suggest.appendChild(liElement);
            }
        }
        else {
            trie.insertWord(s);
            // localStorage => autosuggest-devil
            if (localStorage.getItem("autosuggest-devil")) {
                let newStorage = [...JSON.parse(localStorage.getItem("autosuggest-devil")), s];
                localStorage.setItem("autosuggest-devil", JSON.stringify(newStorage))
            }
            else {
                localStorage.setItem("autosuggest-devil", JSON.stringify([s]));
            }
            let liElement = document.createElement('li');
            liElement.textContent = s;
            suggest.appendChild(liElement);
        }
    }
    else {
        suggest.innerHTML = '';
    }
})

