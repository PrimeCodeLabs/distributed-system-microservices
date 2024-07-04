
import logging
import json

class StructuredLogger:
    def __init__(self, name):
        self.logger = logging.getLogger(name)
        handler = logging.StreamHandler()
        formatter = logging.Formatter('%(message)s')
        handler.setFormatter(formatter)
        self.logger.addHandler(handler)
        self.logger.setLevel(logging.INFO)

    def log(self, level, message, **kwargs):
        log_entry = {
            "level": level,
            "message": message,
            **kwargs
        }
        self.logger.log(level, json.dumps(log_entry))

    def info(self, message, **kwargs):
        self.log(logging.INFO, message, **kwargs)

    def error(self, message, **kwargs):
        self.log(logging.ERROR, message, **kwargs)
                