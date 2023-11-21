const jogo = (escolha) => {
    const escolhas = ["pedra", "papel", "tesoura"]
    const escolhaPc = escolhas[Math.floor(Math.random()*3)]
   
    if(escolha.toLowerCase() === 'pedra'){
        escolhaPc === 'pedra' ? console.log("Você escolheu pedra e o computador escolheu pedra. Empate!") : undefined
        
        escolhaPc === 'papel' ? console.log("Você escolheu pedra e o computador escolheu papel. Você perdeu!") : undefined
        
        escolhaPc === 'tesoura' ? console.log("Você escolheu pedra e o computador escolheu tesoura. Você ganhou!") : undefined
    }

    if(escolha.toLowerCase() === 'papel'){
        escolhaPc === 'pedra' ? console.log("Você escolheu papel e o computador escolheu pedra. Você ganhou!") : undefined
        
        escolhaPc === 'papel' ? console.log("Você escolheu papel e o computador escolheu papel. Empate!") : undefined
        
        escolhaPc === 'tesoura' ? console.log("Você escolheu papel e o computador escolheu tesoura. Você perdeu!") : undefined
    }

    if(escolha.toLowerCase() === 'tesoura'){
        escolhaPc === 'pedra' ? console.log("Você escolheu tesoura e o computador escolheu pedra. Você perdeu!") : undefined

        escolhaPc === 'papel' ? console.log("Você escolheu tesoura e o computador escolheu papel. Você ganhou!") : undefined
        
        escolhaPc === 'tesoura' ? console.log("Você escolheu tesoura e o computador escolheu tesoura. Empate!") : undefined
    }
}

jogo(process.argv[2])