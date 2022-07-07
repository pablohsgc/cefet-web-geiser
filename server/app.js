// importação de dependência(s)
import express from "express";
import fs from 'fs';


// variáveis globais deste módulo
const app = express();
const PORT = 3000
const db = {}
app.use(express.static("client/"))

// carregar "banco de dados" (data/jogadores.json e data/jogosPorJogador.json)
// você pode colocar o conteúdo dos arquivos json no objeto "db" logo abaixo
// dica: 1-4 linhas de código (você deve usar o módulo de filesystem (fs))
const jogadores = JSON.parse(fs.readFileSync("server/data/jogadores.json","utf-8"));
const jogosPorJogador = JSON.parse(fs.readFileSync("server/data/jogosPorJogador.json","utf-8"));
db["jogadores"] = jogadores.players;
db["jogosPorJogador"] = jogosPorJogador; 

// configurar qual templating engine usar. Sugestão: hbs (handlebars)
app.set('view engine', 'hbs');
app.set('views', 'server/views');
// dica: 2 linhas


// EXERCÍCIO 2
// definir rota para página inicial --> renderizar a view index, usando os
// dados do banco de dados "data/jogadores.json" com a lista de jogadores
// dica: o handler desta função é bem simples - basta passar para o template
//       os dados do arquivo data/jogadores.json (~3 linhas)
app.get("/",(req,res) => {
    res.render("index",{jogadores:db.jogadores});
})


// EXERCÍCIO 3
// definir rota para página de detalhes de um jogador --> renderizar a view
// jogador, usando os dados do banco de dados "data/jogadores.json" e
// "data/jogosPorJogador.json", assim como alguns campos calculados
// dica: o handler desta função pode chegar a ter ~15 linhas de código
app.get("/jogador/:id/",(req,res) => {
    const id = req.params.id;
    let jogador = null;
    let jogos = db.jogosPorJogador[id];
    let qtdNaoJogados = 0;
    

    for(let jog of db.jogadores){
        if(jog.steamid === id){
            jogador = jog;
            break;
        }
    }

    for(let i = 0; i < jogos.games.length; i++){
        if(jogos.games[i].playtime_forever === 0){
            qtdNaoJogados++;
        }
    }

    const calcJogos = {
        quantidadeJogos: jogos.game_count,
        quantidadeNaoJogados: qtdNaoJogados
    }

    let top5games = jogos.games;
    top5games.sort((j1,j2) => j2.playtime_forever - j1.playtime_forever);
    top5games = top5games.slice(0,5);
    
    for(let i = 0; i < 5; i++){
        top5games[i].horasJogadas = Math.round(top5games[i].playtime_forever / 60);
    }

    res.render("jogador",{jogador:jogador, jogos:top5games,topGame:top5games[0], calcJogos:calcJogos});
})

// EXERCÍCIO 1
// configurar para servir os arquivos estáticos da pasta "client"
// dica: 1 linha de código


// abrir servidor na porta 3000 (constante PORT)
// dica: 1-3 linhas de código
app.listen(3000,() => {
    console.log("Servidor rodando na porta 3000.")
})