const parOuImpar = (escolha, numero) => {
    const numComputador = Math.floor(Math.random()*5)
    const resultado = numComputador + Number(numero)
   
    if(resultado % 2 ===0 && escolha.toLowerCase() === "par"){
        console.log(`Você escolheu par e o computador escolheu ímpar. O resultado foi ${resultado}. Você ganhou!`)
    } else if (resultado % 2 !==0 && escolha.toLowerCase() === "par"){
        console.log(`Você escolheu par e o computador escolheu ímpar. O resultado foi ${resultado}. Você perdeu!`)
    } else if(resultado % 2 !== 0 && escolha.toLowerCase() === "impar"){
        console.log(`Você escolheu ímpar e o computador escolheu par. O resultado foi ${resultado}. Você ganhou!`)
    } else{
        console.log(`Você escolheu ímpar e o computador escolheu par. O resultado foi ${resultado}. Você perdeu!`)
    }   
}

parOuImpar(process.argv[2], process.argv[3])