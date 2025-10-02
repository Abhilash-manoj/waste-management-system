class MemberLoginController {
  constructor(memberModel) {
    this.memberModel = memberModel;
  }

  validateInput(houseNumber, wardNumber, password) {
    const houseRegex = /^[A-Za-z0-9\-\/]+$/;
    const wardRegex = /^\d+$/;
    const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{6,}$/;
    return (
      houseRegex.test(houseNumber) &&
      wardRegex.test(wardNumber) &&
      passRegex.test(password)
    );
  }

  renderLoginPage(req, res) {
    res.render('memberLogin');
  }

  async login(req, res) {
    const { housenumber, wardnumber, pass } = req.body;

    if (!this.validateInput(housenumber, wardnumber, pass)) {
      return res.render('memberLogin', {
        error: 'Invalid input format.'
      });
    }

    try {
      const member = await this.memberModel.findByHouseNumber(housenumber);

      if (!member || String(member.WardNumber) !== String(wardnumber)) {
        return res.render('memberLogin', {
          error: 'Invalid Username and Password!!!'
        });
      }

      if (!member.Password) {
        return res.render('memberLogin', {
          error: 'Invalid Username and Password!!!'
        });
      }

      const isValid = await this.memberModel.verifyPassword(pass, member.Password);

      if (!isValid) {
        return res.render('memberLogin', {
          error: 'Invalid Username and Password!!!'
        });
      }

      req.session.member = {
        HouseNumber: housenumber,
        WardNumber: wardnumber,
      };

      res.redirect('/memberdashboard');
    } catch (err) {
      res.status(500).send('Server error');
    }
  }

  renderDashboard(req, res) {
    if (!req.session.member) {
      return res.redirect('/memberlogin');
    }

    res.render('memberDashboard', {
      house: req.session.member.HouseNumber,
      ward: req.session.member.WardNumber
    });
  }
}

export default MemberLoginController;