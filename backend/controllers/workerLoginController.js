class WorkerLoginController {
  constructor(workerModel) {
    this.workerModel = workerModel;
  }

  validateInput(workerId, wardNumber, password) {
    const idRegex = /^[A-Za-z0-9\-\/]+$/;
    const wardRegex = /^\d+$/;
    const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{6,}$/;

    return (
      idRegex.test(workerId) &&
      wardRegex.test(wardNumber) &&
      passRegex.test(password)
    );
  }

  renderLoginPage(req, res) {
    res.render('workerLogin');
  }

  async login(req, res) {
    const { workerid, wardnumber, pass } = req.body;

    if (!this.validateInput(workerid, wardnumber, pass)) {
      return res.render('workerLogin', {
        error: 'Invalid input format.'
      });
    }

    try {
      const worker = await this.workerModel.findByWorkerId(workerid);

      if (!worker || String(worker.WardNumber) !== String(wardnumber)) {
        return res.render('workerLogin', {
          error: 'Invalid WorkerID or WardNumber.'
        });
      }

      const isValid = await this.workerModel.verifyPassword(pass, worker.Password);

      if (!isValid) {
        return res.render('workerLogin', {
          error: 'Invalid Password.'
        });
      }

      req.session.worker = {
        WorkerID: workerid,
        WardNumber: wardnumber,
      };

      res.redirect('/workerdashboard');
    } catch (err) {
      console.error('Worker login error:', err);
      res.status(500).send('Server error');
    }
  }

  renderDashboard(req, res) {
    if (!req.session.worker) {
      return res.redirect('/workerlogin');
    }

    res.render('workerDashboard', {
      workerId: req.session.worker.WorkerID,
      ward: req.session.worker.WardNumber
    });
  }
}

export default WorkerLoginController;