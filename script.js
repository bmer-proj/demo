// Notes Management
let notes = [];

function toggleNotes() {
    const notesContent = document.getElementById('notes-content');
    const toggleButton = document.getElementById('toggle-notes');
    if (notesContent.style.display === 'none') {
        notesContent.style.display = 'block';
        toggleButton.textContent = 'Hide Notes';
    } else {
        notesContent.style.display = 'none';
        toggleButton.textContent = 'Notes';
    }
}

// Initialize notes visibility state
document.addEventListener('DOMContentLoaded', () => {
    loadNotes();
});

function loadNotes() {
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
        notes = JSON.parse(savedNotes);
        renderNotes();
    }
}

function saveNote() {
    const noteText = document.getElementById('new-note').value.trim();
    if (noteText) {
        const note = {
            id: Date.now(),
            text: noteText,
            timestamp: new Date().toLocaleString()
        };
        notes.push(note);
        localStorage.setItem('notes', JSON.stringify(notes));
        document.getElementById('new-note').value = '';
        renderNotes();
    }
}

function deleteNote(id) {
    if (confirm('Delete this note?')) {
        notes = notes.filter(note => note.id !== id);
        localStorage.setItem('notes', JSON.stringify(notes));
        renderNotes();
    }
}

function editNote(id) {
    const note = notes.find(n => n.id === id);
    if (note) {
        const newText = prompt('Edit note:', note.text);
        if (newText && newText.trim()) {
            note.text = newText.trim();
            note.timestamp = new Date().toLocaleString() + ' (edited)';
            localStorage.setItem('notes', JSON.stringify(notes));
            renderNotes();
        }
    }
}

function renderNotes() {
    const notesList = document.getElementById('notes-list');
    if (!notesList) return;
    notesList.innerHTML = notes.map(note => `
        <div class="note-item">
            <p>${note.text}</p>
            <small>${note.timestamp}</small>
            <div class="note-actions">
                <button onclick="editNote(${note.id})" class="edit-btn">Edit</button>
                <button onclick="deleteNote(${note.id})" class="delete-person-btn">Delete</button>
            </div>
        </div>
    `).join('');
}

// Data management
class PersonProfile {
    constructor(id, name, relationship, imageUrl) {
        this.id = id;
        this.name = name;
        this.relationship = relationship;
        this.imageUrl = 'profileimg.png';
    }
}

let profiles = {};
let currentProfileId = null;

// Load profiles from localStorage
function loadProfiles() {
    const savedProfiles = localStorage.getItem('profiles');
    if (savedProfiles) {
        profiles = JSON.parse(savedProfiles);
        updateNavigation();
    }
}

// Save profiles to localStorage
function saveProfiles() {
    localStorage.setItem('profiles', JSON.stringify(profiles));
}

// Add new person
function addNewPerson() {
    if (confirm('Add a new person?')) {
        const id = Date.now().toString();
        const newProfile = new PersonProfile(id, 'New Person', 'Relationship to individual', 'profileimg.png');
        profiles[id] = newProfile;
        saveProfiles();
        updateNavigation();
        switchProfile(id);
    }
}

// Delete profile
function deletePerson() {
    if (currentProfileId && confirm('Are you sure you want to remove this profile?')) {
        delete profiles[currentProfileId];
        saveProfiles();
        updateNavigation();
        switchProfile(Object.keys(profiles)[0]);
    }
}

// Switch profile
function switchProfile(id) {
    if (profiles[id]) {
        currentProfileId = id;
        updateUI(profiles[id]);
    }
}

// Update profile data
function updateUI(profile) {
    document.querySelector('.profile-image').src = profile.imageUrl || 'profileimg.png';
    document.querySelector('h2').textContent = profile.name;
    document.querySelector('h4').textContent = profile.relationship;
    document.querySelector('.nav-text').textContent = profile.name;
}

// Update navigation menu
function updateNavigation() {
    const breadcrumb = document.querySelector('.breadcrumb');
    breadcrumb.innerHTML = '';
    
    Object.values(profiles).forEach(profile => {
        const listItem = document.createElement('li');
        const anchor = document.createElement('a');
        anchor.href = `#${profile.id}`;
        anchor.textContent = profile.name;
        anchor.classList.add('nav-text');
        anchor.onclick = (event) => {
            event.preventDefault();
            switchProfile(profile.id);
        };
        if (profile.id === currentProfileId) {
            anchor.classList.add('active');
        }
        listItem.appendChild(anchor);
        breadcrumb.appendChild(listItem);
    });
}

// Navigation
document.addEventListener('DOMContentLoaded', function() {
    loadProfiles();
    initializeNavigation();
    loadNotes();
    if (Object.keys(profiles).length === 0) {
        addNewPerson();
    }
});

function toggleMenu() {
    const menuItems = document.querySelector('.menu-items');
    menuItems.classList.toggle('active');
}

function initializeNavigation() {
    const navLinks = document.querySelectorAll('.breadcrumb a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            
            navLinks.forEach(l => l.classList.remove('active'));
            
            this.classList.add('active');
            
            const content = document.querySelector('.content-wrapper');
            content.style.opacity = '0';
            
            setTimeout(() => {
                content.style.opacity = '1';
            }, 300);
        });
    });
    
    document.querySelector('.menu-items').classList.remove('active');
}

// Edit stuff
function toggleEditImage() {
    const input = document.getElementById('imageInput');
    const saveButton = document.querySelector('button.save-btn');
    input.style.display = input.style.display === 'none' ? 'block' : 'none';
    saveButton.style.display = input.style.display;
    input.addEventListener('change', handleImageChange);
}

function handleImageChange(event) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const profileImage = document.querySelector('.profile-image');
            profileImage.src = event.target.result;
            if (currentProfileId && profiles[currentProfileId]) {
                profiles[currentProfileId].imageUrl = event.target.result;
            }
        };
        reader.readAsDataURL(file);
    } else {
        alert('Please select a valid image file.');
    }
}

function saveImageChanges() {
    const input = document.getElementById('imageInput');
    saveProfiles();
    input.style.display = 'none';
    document.querySelector('button.save-btn').style.display = 'none';
}

function toggleEditName() {
    const input = document.getElementById('nameInput');
    const saveButton = document.querySelector('.name-section .save-btn');
    const currentName = document.querySelector('h2').textContent;
    input.style.display = input.style.display === 'none' ? 'block' : 'none';
    saveButton.style.display = input.style.display;
    if (input.style.display === 'block') {
        input.value = currentName;
    }
}

function saveNameChanges() {
    const input = document.getElementById('nameInput');
    const newName = input.value;
    if (currentProfileId && profiles[currentProfileId]) {
        profiles[currentProfileId].name = newName;
        document.querySelector('h2').textContent = newName;
        document.querySelector('.nav-text').textContent = newName;
        saveProfiles();
        updateNavigation();
        input.style.display = 'none';
        document.querySelector('.name-section .save-btn').style.display = 'none';
    }
}

function toggleEditRelationship() {
    const input = document.getElementById('relationshipInput');
    const saveButton = document.getElementById('relationshipSaveBtn');
    const currentRelation = document.querySelector('h4').textContent;
    input.style.display = input.style.display === 'none' ? 'block' : 'none';
    saveButton.style.display = input.style.display;
    if (input.style.display === 'block') {
        input.value = currentRelation;
    }
}

function saveRelationshipChanges() {
    const input = document.getElementById('relationshipInput');
    const newRelation = input.value;
    if (currentProfileId && profiles[currentProfileId]) {
        profiles[currentProfileId].relationship = newRelation;
        document.querySelector('h4').textContent = newRelation;
        saveProfiles();
        input.style.display = 'none';
        document.getElementById('relationshipSaveBtn').style.display = 'none';
    }
}

let textInput = document.getElementById("text-input");
let submitButton = document.getElementById("submit-button");
let welcomeText = document.getElementById("welcome-text");

submitButton.addEventListener("click", textOutput);

function textOutput() {
  console.log(textInput.value);
  welcomeText.innerText = "Welcome, " + textInput.value;
}

function showTopic(topic) {
    const topics = {
        family: [
            "Who's your favorite family member?",
            "Tell me about your children.",
            "What did you do with your family on holidays?"
        ],
        food: [
            "What's your favorite dessert?",
            "Did you cook when you were younger?",
            "What foods remind you of home?"
        ],
        hobbies: [
            "Have you traveled to any exciting places?",
            "What was your favorite vacation?",
            "Where would you like to visit again?"
        ]
    };

    const questions = topics[topic];
    if (!questions) return;

    alert(`Conversation Topic: ${topic.charAt(0).toUpperCase() + topic.slice(1)}\n\nQuestions:\n${questions.join('\n')}`);
}

function showActivityPopup(activityType) {

    const activityDetails = {
        walk: {
            title: "Take a Short Walk",
            instructions: ["Choose a familiar route", "Hold hands if needed", "Point out interesting things"],
        },
        music: {
            title: "Listen to Music",
            instructions: ["Play favorite songs", "Sing together", "Discuss memories"],
        },
        photo: {
            title: "Look at Photos",
            instructions: ["Show recent photos", "Ask about people in pictures", "Share stories"],
        }
    };
    const details = activityDetails[activityType];
    alert(`${details.title}\n\nInstructions:\n${details.instructions.join('\n')}`);
}
