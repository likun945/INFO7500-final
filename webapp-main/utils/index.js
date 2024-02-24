export default function customResponses(req, res, next) {
    res.success = function (data, message = "Success", status = 200) {
        this.status(status).json({ message, success: true, data });
    };

    res.error = function (message = "Error", status = 400) {
        this.status(status).json({ message, success: false });
    };

    next();
};
