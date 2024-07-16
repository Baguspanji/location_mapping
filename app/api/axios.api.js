const { default: axios } = require("axios");

exports.createAbsence = async (req, res) => {
    
    // date 2024-03-01 06:00:00
    let startDate = new Date('2024-03-01');
    let endDate = new Date('2024-03-23');

    try {
        // loop date
        let bodies = []
        let responses = []
        while (startDate <= endDate) {
            bodies.push(`1\t${startDate.toISOString().slice(0, 19).replace('T00:00:00', ' ')}06:45:00\t0\t1\t0\t0\t0\t0\t0\t0`);
            bodies.push(`1\t${startDate.toISOString().slice(0, 19).replace('T00:00:00', ' ')}13:45:00\t0\t1\t0\t0\t0\t0\t0\t0`);
            startDate.setDate(startDate.getDate() + 1);
        }

        for (let i = 0; i < bodies.length; i++) {
            let body = bodies[i];
            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'https://dev-joja.com/iclock/cdata?SN=NJF7234200849&table=ATTLOG&Stamp=9999',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'text/plain'
                },
                data: body
            };

            const response = await axios.request(config)
            responses.push(response.data);
        }

        res.json({
            message: 'Success',
            response: responses
        })
    } catch (error) {
        res.json({
            message: 'Failed',
            error
        })
    }
};