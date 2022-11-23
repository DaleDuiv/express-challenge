const express = require("express");
const fs = require("fs");
const path = require("path");
const util = require("util");
const dbData = require("./Develop/db/db.json");



const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);
const notes = [].concat(JSON.parse(data));

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("./Develop/public"));

app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "./Develop/public/index.html"))
);

app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "./Develop/public/notes.html"))
);

app.get("*", (req, res) => 
  res.sendFile(path.join(__dirname, "./Develop/public/index.html"))
)


app.get("/api/notes", (req, res) => {
    res.json(dbData);
  })



app.post("/api/notes", (req, res) => {
  const note = req.body;
  readFileAsync(dbData, "utf-8").then((data) => {
  notes.id = notes.length + 1
  notes.push(note);
  return notes;  
  }).then((notes) => {
    writeFileAsync(dbData, JSON.stringify(notes));
    res.json(note);
  })
});

app.delete("/api/notes/:id", (req,res) => {
  const idToDelete = parseInt(req.params.id);
  readFileAsync(dbData, "utf-8").then((data) => {
    const newNotesData = []
    for (let i = 0; i < notes.length; i++) {
      if(idToDelete !== notes[i].id) {
        newNotesData.push(notes[i])
      }
    }
    return newNotesData
  }).then((notes) => {
  writeFileAsync(dbData, JSON.stringify(notes))
  res.send("saved sucessfully!");
  })
});

app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT} 🚀`)

})