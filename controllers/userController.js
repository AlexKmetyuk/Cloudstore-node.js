const loginController = async(req, res) => {
    try {
        const { login, password } = req.body

        const [_, isPlaytika] = login.split('@')

        if (isPlaytika === 'playtika.com' && password === "First1Logon") {
            res.status(200).json({ status: 'ok', message: `Success, ${_} is authorized!`, isLogin: true })
        } else {
            res.status(401).json({ status: 'error', message: 'Invalid login or password!', isLogin: false })
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ "Server error": error })
    }
}

module.exports = {
    loginController
}