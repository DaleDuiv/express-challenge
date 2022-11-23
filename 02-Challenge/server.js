const express = require("express");
const fs = require("fs");
const path = require("path");
const util = require("util");


const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("./Develop/public"));


app.get("/api/notes", function(req, res) {
  readFileAsync("./develop/db/db.json", "utf8").then(function(data) {
    notes = [].concat(JSON.parse(data))
    res.json(notes);
  })

});

app.post("/api/notes", function(req, res) {
  const note = req.body;
  readFileAsync("./develop/db/db.json", "utf8").then(function(data) {
  const notes = [].concat(JSON.parse(data));
  notes.id = notes.length + 1
  notes.push(note);
  return notes  
  }).then(function(notes) {
    writeFileAsync("./develop/db/db.json", JSON.stringify(notes));
    res.json(note);
  })
});

app.delete("/api/notes/:id", function(req,res) {
  const idToDelete = parseInt(req.params.id);
  readFileAsync("./develop/db/db.json", "utf8").then(function(data) {
    const notes = [].concat(JSON.parse(data));
    const newNotesData = []
    for (let i = 0; i<notes.length; i++) {
      if(idToDelete !== notes[i].id) {
        newNotesData.push(notes[i])
      }
    }
    return newNotesData
  }).then(function(notes) {
  writeFileAsync("./Develop/db/db.json", JSON.stringify(notes))
  res.send("saved sucessfully!");
  })
});

app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "./Develop/public/notes.html"))
);

app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "./Develop/public/index.html"))
);


app.get("*", (req, res) => 
  res.sendFile(path.join(__dirname, "./Develop/public/index.html"))
)



app.listen(PORT, function() {
  console.log(`App listening at http://localhost:${PORT} 🚀`)

})