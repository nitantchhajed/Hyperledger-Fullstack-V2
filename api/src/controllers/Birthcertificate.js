const { body, check, sanitize, validationResult } = require("express-validator");
const generateUniqueId = require('generate-unique-id');
const invoke = require('../../app/invoke-transaction.js');
const helper = require('../../app/Helper.js');
const query = require('../../app/query.js');
var log4js = require('log4js');
var logger = log4js.getLogger('SampleWebApp');
// const UserModel = require("../models/Birth");
require('../../config.js');
const prometheus = require('prom-client');

///////////////////////////////////////////////////////////////////////////////
//////////////////////////////// PROMETHEUS METRICS CONFIGURATION /////////////
///////////////////////////////////////////////////////////////////////////////
const writeLatencyGauge = new prometheus.Gauge({ name: 'write_latency', help: 'latency for write requests' });
const requestCountGauge = new prometheus.Gauge({ name: 'request_count', help: 'requests count' });
const readLatencyGauge = new prometheus.Gauge({ name: 'read_latency', help: 'latency for read requests' });
const queriesCountGauge = new prometheus.Gauge({ name: 'queries_count', help: 'queries count' });
const totalTransaction = new prometheus.Gauge({ name: 'total_transaction', help: 'Counter for total transaction' })
const failedTransaction = new prometheus.Gauge({ name: 'failed_transaction', help: 'Counter for failed transaction' })
const successfulTransaction = new prometheus.Gauge({ name: 'successful_transaction', help: 'counter for successful transaction' })


async function store(req, res, next) {

    try {
        await check("name").notEmpty().withMessage('Name of the child filed must be requerd').run(req);
        await check("father_name").notEmpty().withMessage('Name of the father filed must be requerd').run(req);
        await check("mother_name").notEmpty().withMessage('Name of the mother filed must be requerd').run(req);
        await check("dob").notEmpty().withMessage('Date of Birth filed must be requerd').run(req);
        await check("gender").notEmpty().withMessage('please select gender').run(req);
        await check("country").notEmpty().withMessage('Country filed must be requerd').run(req);
        await check("state").notEmpty().withMessage('State filed must be requerd').run(req);
        await check("city").notEmpty().withMessage('City filed must be requerd').run(req);
        await check("permanent_address").notEmpty().withMessage('Permanent address filed must be requerd').run(req);
        await check("hospital_name").notEmpty().withMessage('Name of hospital filed must be requerd').run(req);



        const errors = validationResult(req);
        console.log("errors..........", errors);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        var peers = ["peer0.org1.example.com"];
		var chaincodeName = "birthcert";
		var channelName = "mychannel";
		var fcn = "createBirthCert";

        var args = [];
		const id = generateUniqueId();

        args.push(id, req.body.name, req.body.father_name, req.body.mother_name, req.body.dob, req.body.gender, req.body.weight, req.body.country, req.body.state, req.body.city, req.body.hospital_name, req.body.permanent_address  );

        const start = Date.now();
		let message = await invoke.invokeChaincode("admin", channelName, chaincodeName, fcn, args);

        let getUser = await query.queryChaincode("admin", channelName, chaincodeName, 'getBirthCert', [id]);
		console.log("ghfghgfhfgh",peers, channelName, chaincodeName, fcn, args, "admin", "Org1");
        console.log("getUser",getUser);
        console.log("message",message);
		const latency = Date.now() - start;

        let data = {
            key : id,
            tx_id: message,
            Record: {
                name: req.body.name,
                father_name: req.body.father_name,
                mother_name: req.body.mother_name,
                docType: "birthCert",
                dob: req.body.dob,
                gender: req.body.gender,
                weight: req.body.weight,
                country: req.body.country,
                state:  req.body.state,
                city: req.body.city,
                hospital_name: req.body.hospital_name,
                permanent_address: req.body.permanent_address
            },

        }

		writeLatencyGauge.inc(latency)
		requestCountGauge.inc()
		successfulTransaction.inc()
        // const response = yield helper_1.default.registerAndGerSecret(user.email, user.orgname);

        return res.status(200).json({
            status: 200,
            message: "Birthday certificate created successfully!",
            data:data
        })

    }
    catch (error) {
        res.status(400).json({
            status: 400,
            message: "Somethings went wrong",
            error: error.message
        })
    }
}


async function index(req, res, next) {
    try {

        var channelName = "mychannel";
		var chaincodeName = "birthcert";
		let args = req.query.args;
		let fcn = 'allList';


        if (!args) {
			res.json(getErrorMessage('\'args\''));
			return;
		}
		console.log('args==========', args);
		args = args.replace(/'/g, '"');
		args = JSON.parse(args);
		logger.debug(args);

        const start = Date.now();
		let message = await query.queryChaincode("admin", channelName, chaincodeName, fcn, args);
        // message = message.replace(/'/g, '"');
		const latency = Date.now() - start;
        readLatencyGauge.inc(latency)
		queriesCountGauge.inc()
        data = JSON.parse(message)
        return res.status(200).json({
            status: 200,
            message: "All User found successfully",
            data: data
        })

    } catch (error) {
        res.status(400).json({
            status: 400,
            message: "Somethings went wrong",
            error: error.message
        })
    }
}

async function show(req, res, next){
    try {

        var channelName = "mychannel";
		var chaincodeName = "birthcert";
		let args = req.query.args;;
		let fcn = 'getBirthCert';

        if (!args) {
			res.json(getErrorMessage('\'args\''));
			return;
		}
		console.log('args==========', args);
		args = args.replace(/'/g, '"');
		args = JSON.parse(args);
		logger.debug(args);

        const start = Date.now();
		let message = await query.queryChaincode("admin", channelName, chaincodeName, fcn, args);
        // message = message.replace(/'/g, '"');
		const latency = Date.now() - start;
        readLatencyGauge.inc(latency)
		queriesCountGauge.inc()
        data = JSON.parse(message)
        data = {
            key:args[0],
            Record:data
        }
        return res.status(200).json({
            status: 200,
            message: "Birth certificate successfully",
            data: data
        })

    } catch (error) {
        res.status(400).json({
            status: 400,
            message: "Somethings went wrong",
            error: error.message
        })
    }
}


exports.store = store;
exports.index = index;
exports.show = show;
