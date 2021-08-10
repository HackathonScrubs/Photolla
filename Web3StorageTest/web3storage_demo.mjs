import { Web3Storage, getFilesFromPath } from 'web3.storage'
import { XMLHttpRequest } from 'xmlhttprequest'

const token = process.env.API_TOKEN;
const client = new Web3Storage({ token });

async function storeFiles (path) {
	const file = await getFilesFromPath(path);
	const cid = await client.put(file);
	return cid;
}

async function retrieveFiles (cid) {
	const res = await client.get(cid);
	const files = await res.files();
	return files;
}

function checkGateway(url) {
	return new Promise((resolve, reject) => {
		var request = new XMLHttpRequest();
		request.open("GET", url, true);
		request.send();
		request.onload = function () {
			var status = request.status;
			if (status == 200) {
				resolve(true);
			} else {
				resolve(false);
			}
		}
	});
}

async function getAddr(file, cid) {
	if (await checkGateway("https://" + file.cid + ".ipfs.dweb.link")) {
		return "https://" + file.cid + ".ipfs.dweb.link";
	}
	if (await checkGateway("https://" + cid + ".ipfs.dweb.link/" + file.name)) {
		return "https://" + cid + ".ipfs.dweb.link/" + file.name;
	}
	if (await checkGateway("https://ipfs.io/ipfs/" + file.cid)) {
		return "https://ipfs.io/ipfs/" + file.cid;
	}
	if (await checkGateway("https://ipfs.io/ipfs/" + cid + "/" + file.name)) {
		return "https://ipfs.io/ipfs/" + cid + "/" + file.name;
	}
	return "http://www.macedonrangeshalls.com.au/wp-content/uploads/2017/10/image-not-found.png";
}

import http from 'http'
import formidable from 'formidable'
import fs from 'fs'

import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

http.createServer(function (req, res) {
	if (req.url == '/fileupload') {
		var form = new formidable.IncomingForm();
		form.multiples = true;
		form.parse(req, function (err, fields, files) {
			if (err) throw err;
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.write(`
				<head>
					<title>Web3.Storage Demo</title>
					<link rel='stylesheet' href='stylesheet.css'>
				</head>
				<div class='container'>
					<header class='header'>
						<h1>Web3.Storage Demo</h1>
						<h3>Uploading & Generating URLs...</h3>
					</header>
					<section class='content'>
						<div class='content-body'>
							<p id="urls">URLs</p><br>`);
			if (!files.uploadfile.length) {
				files.uploadfile = [files.uploadfile];
			}
			for (let i = 0; i < files.uploadfile.length; i++) {
				storeFiles(files.uploadfile[i].path).then(cid => {
					var file = files.uploadfile[i];
					var fileName = file.name.split('.')[0] + ".html";
					var hash = "<p>Hash: " + cid + "</p>";
					fs.copyFile("fileDownload.html", path.join(__dirname, fileName), (err) => {
						if (err) throw err;
						fs.appendFileSync(path.join(__dirname, fileName), hash);
					});
					res.write("<a href='" + fileName + "'>" + file.name + "</a><br>");
					if (i == files.uploadfile.length - 1) {
						res.write(`
								</div>
							</section>
							<footer>
								<small>Powered by Web3.Storage & IPFS / Demo by Hoo Yun Zhe</small>
							</footer>
						</div>`)
						return res.end();
					}
				});
			}
		});
	} else if (req.url.endsWith(".html")) {
		fs.readFile(path.join(__dirname, decodeURI(req.url)), "utf8", (err, data) => {
			if (err) throw err;
			retrieveFiles(data.match('<p>Hash: (.*?)</p>')[1]).then(x => {
				res.writeHead(200, {'Content-Type': 'text/html'});
				if (!data.match('<img src=')) {
					getAddr(x[0], data.match('<p>Hash: (.*?)</p>')[1]).then(addr => {
						var img = "<br><img src='" + addr + "'/><br>";
						var final = `
								</div>
							</section>
							<footer>
								<small>Powered by Web3.Storage & IPFS / Demo by Hoo Yun Zhe</small>
							</footer>
						</div>`
						fs.appendFileSync(path.join(__dirname, decodeURI(req.url)), img + final);
						fs.createReadStream(path.join(__dirname, decodeURI(req.url))).pipe(res);
					});
				} else {
					fs.createReadStream(path.join(__dirname, decodeURI(req.url))).pipe(res);
				}
			});
		});
	} else if (req.url.endsWith(".css")) {
		res.writeHead(200, {'Content-Type': 'text/css'});
		fs.createReadStream('stylesheet.css').pipe(res);
	} else {
		res.writeHead(200, {'Content-Type': 'text/html'});
		fs.createReadStream('fileUpload.html').pipe(res);
	}
}).listen(8080);
