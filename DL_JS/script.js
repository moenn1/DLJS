function emailValide(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}
const email1 = "email@exemple.com";
if (emailValide(email1)) {
  console.log("L'adresse e-mail est valide");
} else {
  console.log("L'adresse e-mail n'est pas valide");
}

function telValide(tel) {
  const regex = /^06\d{8}$/;
  return regex.test(tel);
}
const tel1 = "0612345678";
if (telValide(tel1)) {
  console.log("Le numéro de téléphone est valide");
} else {
  console.log("Le numéro de téléphone n'est pas valide");
}


function ageValide(date){
  if (date == "") 
    return false;
  var dateNaissance = new Date(date);
  var dateActuelle = new Date();
  var age = dateActuelle.getFullYear() - dateNaissance.getFullYear();
  var mois = dateActuelle.getMonth() - dateNaissance.getMonth();
  if (mois < 0 || (mois === 0 && dateActuelle.getDate() < dateNaissance.getDate())) {
      age--;
  }
  return age >= 18;
}

// 


let etudiantEnCoursDeModification = null;

// Fonction pour valider les champs du formulaire
function validerFormulaire(form) {
  const nom = form.nom.value;
  const prenom = form.prenom.value;
  const dateNaissance = form.dateNaissance.value;
  const filiere = form.filiere.value;
  const email = form.email.value;
  const tel = form.tel.value;
  const notes = Array.from(form.querySelectorAll('input[name="note"]')).map(input => parseFloat(input.value));
  var erreur = "";

  if (nom.length < 2) {
    erreur += "Le nom doit contenir au moins deux caractères.\n";
  }

  if (prenom.length < 2) {
    erreur += "Le prénom doit contenir au moins deux caractères.\n";
  }

  if (!ageValide(dateNaissance)) {
    erreur += "La date de naissance doit être une date valide si l’étudiant à 18 et plus.\n";
  }

  if (filiere.length < 3) {
    erreur += "La filière doit contenir au moins trois caractères.\n";
  }

  if (!emailValide(email)) {
    erreur += "L'e-mail doit être une adresse e-mail valide.\n";
  }

  if (!telValide(tel)) {
    erreur += "Le numéro de téléphone doit être un numéro de téléphone valide.\n";
  }

  if (erreur != "") {
    alert(erreur);
    return false;
  }


  const etudiant = { nom, prenom, dateNaissance, filiere, email, tel, notes, moyenne: calculerMoyenne(notes) };

  if (etudiantEnCoursDeModification) {
      modifierEtudiant(etudiantEnCoursDeModification, etudiant);
  } else {
      ajouterEtudiant(etudiant);
  }

  form.reset();
  return false;
   
}

function calculerMoyenne(notes) {
  const somme = notes.reduce((acc, note) => acc + note, 0);
  return parseFloat((somme / notes.length).toFixed(1));
}


function ajouterEtudiant(etudiant) {
  const tableEtudiants = document.getElementById('tableEtudiants').querySelector('tbody');
  const newRow = tableEtudiants.insertRow();

  newRow.innerHTML = `
      <td>${etudiant.nom}</td>
      <td>${etudiant.prenom}</td>
      <td>${etudiant.dateNaissance}</td>
      <td>${etudiant.filiere}</td>
      <td>${etudiant.email}</td>
      <td>${etudiant.tel}</td>
      <td>${JSON.stringify(etudiant.notes)}</td>
      <td>${etudiant.moyenne}</td>
      <td>
          <button class="modifier">Modifier</button>
          <button class="supprimer">Supprimer</button>
      </td>
  `;

  newRow.querySelector('.modifier').addEventListener('click', () => chargerEtudiantDansFormulaire(etudiant, newRow));
  newRow.querySelector('.supprimer').addEventListener('click', () => supprimerEtudiant(newRow));
}


function chargerEtudiantDansFormulaire(etudiant, row) {
  const form = document.getElementById('formEtudiant');
  form.nom.value = etudiant.nom;
  form.prenom.value = etudiant.prenom;
  form.dateNaissance.value = etudiant.dateNaissance;
  form.filiere.value = etudiant.filiere;
  form.email.value = etudiant.email;
  form.tel.value = etudiant.tel;

  const divNote = form.querySelector('[name="divNote"]');
  divNote.querySelectorAll('input[name="note"]').forEach((input, index) => {
      if (index < etudiant.notes.length) {
          input.value = etudiant.notes[index];
      } else {
          divNote.removeChild(input);
      }
  });

  etudiantEnCoursDeModification = row;
}


function modifierEtudiant(row, etudiant) {
  const cells = row.querySelectorAll('td');
  cells[0].textContent = etudiant.nom;
  cells[1].textContent = etudiant.prenom;
  cells[2].textContent = etudiant.dateNaissance;
  cells[3].textContent = etudiant.filiere;
  cells[4].textContent = etudiant.email;
  cells[5].textContent = etudiant.tel;
  cells[6].textContent = JSON.stringify(etudiant.notes);
  cells[7].textContent = etudiant.moyenne;

  etudiantEnCoursDeModification = null;
}

function supprimerEtudiant(row) {
  if (confirm('Êtes-vous sûr de vouloir supprimer cet étudiant ?')) {
      row.remove();
  }
}

function ajouterNote() {
  const divNote = document.querySelector('div[name="divNote"]');
    const notes = divNote.querySelectorAll('input[name="note"]');

    if (notes.length >= 4) {
        alert("Chaque étudiant doit avoir 4 notes maximum");
        return;
    }
    if (Array.from(notes).some(note => note.value === "")) {
        alert("Veuillez remplir les champs de note existants avant d'ajouter une nouvelle note.");
        return;
    }
    const newNote = document.createElement('input');
    newNote.type = 'number';
    newNote.name = 'note';
    divNote.insertBefore(newNote, divNote.querySelector('#ajouterNote'));

    newNote.addEventListener('input', updateMoyenne);
}

function supprimerNote() {
  const divNote = document.querySelector('[name="divNote"]');
  const notes = divNote.querySelectorAll('input[name="note"]');
  if (notes.length > 1) {
      divNote.removeChild(notes[notes.length - 1]);
  }
}

document.getElementById("ajouterNote").addEventListener("click", ajouterNote);

document.querySelectorAll(".modifier").forEach(modifierButton => {
    modifierButton.addEventListener("click", event => {
        const row = event.target.closest("tr");
        chargerEtudiantDansFormulaire(row);
    });
});

document.querySelectorAll(".supprimer").forEach(supprimerButton => {
    supprimerButton.addEventListener("click", event => {
        const row = event.target.closest("tr");
        supprimerEtudiant(row);
    });
});
