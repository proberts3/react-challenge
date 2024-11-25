## Questions

### What issues, if any, did you find with the existing code?

- I had to run `docker compose build` instead of `docker run build` to get things running. I guess I could have done that in the individual directories.
- for the number input fields there were no constraints, meaning you could input any value in the HTML spec, including the letter 'e', negative numbers, and above the current account amount.
- Linting & formatting in general.
- Few Type issues, specifically for the input event.
- Technically in Google's Material Design system you're not supposed to stack Cards (Paper?) on top of each other [source.](https://ux.stackexchange.com/questions/100033/material-design-card-within-a-card)

### What issues, if any, did you find with the request to add functionality?

- AC2: A customer can withdraw no more than $400 in a single day.
    - This one can get deep real quickly and I kept it simple for the project by just adding a value called todays_widthdrawals. I can imagine a bank would have a lot of rules and requirements around this and you'd need a new table of just transactions to cover this.
- AC3: A customer can withdraw any amount that can be dispensed in $5 bills.
    - I would normally ask a PM to clarify this requirement. I tried to interpret this within 'reason' and made it so the user could only widthdraw amounts in $5 increments.
- I would ask if there's a daily limit on deposits.
- Not part of the project requirements but I would ask if there's any type of monitoring / limits as a customer approaches $10,000 in a set amount of time, due to Federal limits on reporting widthdrawals and transfers.


### Would you modify the structure of this project if you were to start it over? If so, how?

- For the backend I'd probably just go with old MVC names on things: Models, Controllers, Services, Routes and then you can add your Middleware and Utils. 'handlers' is a bit strange for your database layer.
- I do like to put a shared types folder when I'm doing work jumping between front-end / back-end in one project, but everyone might not agree with that.
- I'd seriously consider moving the front-end to Vite. Also Node is supporting TypeScript natively soon so that will be exciting.
- All things considered I still like Express over other backend JS frameworks, it's stable.

### Were there any pieces of this project that you were not able to complete that you'd like to mention?

- The fix I implemented for the inputs use newer HTML attributes and may not be honored by all / older browsers (not Chrome). I would spend some time QA'ing in other browsers we would want to target.
- You're using Joi for input validation which is good. I'd take a deeper look and make sure we're properly validating things.
- I would add a proper Error Banner and messaging to the frontend.

### If you were to continue building this out, what would you like to add next?

- The first thing I would look at for scaling this project is how we are handling multiple connections. I would think we'd need to lock the database if we're making multiple withdrawals. You'd probably have something like a Redis service in front of the database to mediate between your servers.
- I'd add tests!
- Proper authentication & login flow would be another immediatly needed piece.
- Take a look at the warning messages in the build.
- Better error messaging.
- I'd look at a CSS system. I'm less warm on SASS these days but it needs some structure.
- Some of the CSS isn't needed or already coverd by Material UI
- I could notify about the widthdrawal limit being reached

### If you have any other comments or info you'd like the reviewers to know, please add them below.

Thank you for the opportunity and taking the time to review my submission! My work mostly deals with moving a lot of data around instead of traditional banking so this was a fun project.