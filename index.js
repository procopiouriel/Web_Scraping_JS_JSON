
const Dados = require('./Dados.js');
const Restricoes = require('./Restricoes.js');



const puppeteer = require('puppeteer');
const fs = require('fs'); // Importando o módulo 'fs' para operações de sistema de arquivos

async function webScraping() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('AQUI FICAVA O LINK DA PAGUNA');
  await page.waitForTimeout(3000); 
  let TodasInformacoes = null;
  const demonstrativosCobertura = new Array(19);

  //DEMONSTRATIVOS
  let index = 0;
  const demonstrativos = await page.$$('.col-md-9');
  for await (const element of demonstrativos) {
      const textContent = await element.evaluate(node => node.textContent);
      demonstrativosCobertura[index] = textContent;
      index++;
  }

  //RESTANTE
  const restante = await page.$$('.col-md-5');
  for await (const element of restante) {
      const textContent = await element.evaluate(node => node.textContent);
      demonstrativosCobertura[index] = textContent;
      index++;
  }

  //CAPTURAR RESTRICOES
  const listrestricoesIR = new Array(1000);
  let ocorrencias = 0
  const restricoes = await page.$$('td');
  for await (const element of restricoes) {
      const textContent = await element.evaluate(node => node.textContent);
      listrestricoesIR[ocorrencias] = textContent;
      ocorrencias++;        
  }
  await page.close();


  //LIMPAR VALORES INUTEIS QUE FORAM PEGOS NO WEB SCRAPING
  demonstrativosCobertura[10] = null;
  demonstrativosCobertura[11] = null;


  const CondicaoDoCadastro = demonstrativosCobertura[0];
  const CondicaoDoPra = demonstrativosCobertura[1];
  const RegistroDoCar = demonstrativosCobertura[2];
  const AreaDoImovel = demonstrativosCobertura[3];
  const ModulosFiscais = demonstrativosCobertura[4];
  const MunicipiosUF = demonstrativosCobertura[5];
  const Centroide = demonstrativosCobertura[6];
  const DataDeRegistro = demonstrativosCobertura[7];
  const DataDaAnalise = demonstrativosCobertura[8];
  const DataDaUltimaRetificacao = demonstrativosCobertura[9];
  const Remascentes = demonstrativosCobertura[12];
  const Consolidado = demonstrativosCobertura[13];
  const ServidaoAdminstrativa = demonstrativosCobertura[14];
  const SituacaoReserva = demonstrativosCobertura[15];
  const Averbada = demonstrativosCobertura[16];
  const Aprovada = demonstrativosCobertura[17];
  const Proposta = demonstrativosCobertura[18];
  const Declarada = demonstrativosCobertura[19];
  const PreservacaoPermanente = demonstrativosCobertura[20];
  const UsoRestrito = demonstrativosCobertura[21];

 let contador = 0
  let vezes = ocorrencias / 5
  const Restricao1 = new Array(vezes);

  for (let i = 0; i < ocorrencias; i++){
      while (contador < vezes){
          let Origem = listrestricoesIR[i];
          i++;
          let Descricao = listrestricoesIR[i];
          i++;
          let Processamento = listrestricoesIR[i];
          i++
          let AreaDeConflito = listrestricoesIR[i];
          i++;
          let Percentual = listrestricoesIR[i];
          i++;
          Restricao1[contador] = new Restricoes(Origem, Descricao, Processamento, AreaDeConflito, Percentual);
          contador++;
      }
  }
  const instanciaDados = new Dados(CondicaoDoCadastro, CondicaoDoPra, RegistroDoCar, AreaDoImovel, ModulosFiscais, MunicipiosUF, Centroide, DataDeRegistro, DataDaAnalise, DataDaUltimaRetificacao, Remascentes, Consolidado, ServidaoAdminstrativa, SituacaoReserva, Averbada, Aprovada, Proposta, Declarada, PreservacaoPermanente, UsoRestrito, Restricao1);
  //ESTA VARIAVEL TODASINFORMACOES QUE CONTEM TUDO
  TodasInformacoes = instanciaDados;
  //console.log(TodasInformacoes);

  //JSON
  const jsonDados = JSON.stringify(TodasInformacoes, null, 2);
  const jsonFormatado = `${jsonDados}\n`; 
  fs.writeFile('Dados.json', jsonFormatado, 'utf8', (err) => {
    if (err) {
      console.error('Erro ao escrever arquivo:', err);
      return;
    }
    console.log('Arquivo JSON criado com sucesso!');
  });
}

webScraping();